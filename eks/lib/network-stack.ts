import { Stack, StackProps, aws_ec2 as ec2, Tags, CfnOutput } from 'aws-cdk-lib';
import { CfnRoute } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface NetworkStackProps extends StackProps {
  transitGatewayId: string
}

export class NetworkStack extends Stack {
  vpc: ec2.IVpc;
  sg: ec2.ISecurityGroup;
  vpcId: string;
  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'eks-blueprint-vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.100.0.0/16'),
      maxAzs: 3,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 20,
          name: 'workers',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'tgw',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Tag Private Subnets
    this.vpc.privateSubnets.forEach((subnet) => {
      Tags.of(subnet).add("kubernetes.io/role/internal-elb", "1")
      Tags.of(subnet).add("karpenter.sh/discovery", "eks-blueprint")
    })

    // Tag Public Subnets
    this.vpc.publicSubnets.forEach((subnet) => {
      Tags.of(subnet).add("kubernetes.io/role/elb", "1")
    })

    // Connect to TGW
    const tgwSubnets = this.vpc.selectSubnets({ subnetGroupName: 'tgw' })

    const attach = new ec2.CfnTransitGatewayAttachment(this, 'eks-blueprint-vpc-tgw-attach', {
      subnetIds: tgwSubnets.subnetIds,
      vpcId: this.vpc.vpcId,
      transitGatewayId: props.transitGatewayId
    })

    // Add route to homelab
    const allSubnets = this.vpc.privateSubnets.concat(this.vpc.isolatedSubnets)
    allSubnets.forEach((subnet, index) => {
      new CfnRoute(this, 'OnPremRoute' + index, {
        destinationCidrBlock: '192.168.1.0/24',
        routeTableId: subnet.routeTable.routeTableId,
        transitGatewayId: props.transitGatewayId
      }).addDependency(attach)
    })

    // EKS Security Group
    this.sg = new ec2.SecurityGroup(this, 'eks-blueprint-workers-sh', {
      vpc: this.vpc,
      allowAllOutbound: true,
      securityGroupName: id,
    })
    this.sg.addIngressRule(ec2.Peer.ipv4('10.100.0.0/16'), ec2.Port.allTraffic())

    Tags.of(this.sg).add("karpenter.sh/discovery", "eks-blueprint")
    Tags.of(this.sg).add("kubernetes.io/cluster/eks-blueprint", "owned")
    new CfnOutput(this, 'eks-blueprint-vpcid', { exportName: 'vpcId', value: this.vpc.vpcId })
  }
}

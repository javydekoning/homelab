import { Stack, StackProps, aws_efs as efs, aws_ec2 as ec2, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface StorageStackProps extends StackProps {
    vpc: ec2.IVpc
}

export class StorageStack extends Stack {
  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    const fs = new efs.FileSystem(this, 'efs-for-eks-lab', {
        vpc: props.vpc,
        vpcSubnets: props.vpc.selectSubnets({subnetType: ec2.SubnetType.PRIVATE_WITH_NAT})
    })
    fs.connections.allowFrom(ec2.Peer.ipv4(props.vpc.vpcCidrBlock), ec2.Port.tcp(2049))
    fs.connections.allowFrom(ec2.Peer.ipv4('192.168.1.0/24'), ec2.Port.tcp(2049))
  }
}

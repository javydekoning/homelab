import { Stack, IResource, StackProps, aws_eks as eks } from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from 'constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';

export interface EksLabStackProps extends StackProps {
  vpc: IVpc;
  zone: IHostedZone;
  certificateArn: string;
}

export class EksLabStack extends Stack {
  constructor(scope: Construct, id: string, props: EksLabStackProps) {
    super(scope, id, props);

    const clusterProvider = new blueprints.GenericClusterProvider({
      version: eks.KubernetesVersion.V1_21,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUDIT,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
        eks.ClusterLoggingTypes.SCHEDULER
      ],
      fargateProfiles: {
        karpenter: {
          fargateProfileName: 'karpenter',
          selectors: [{ namespace: 'karpenter' }],
        },
      },
    });

    const addOns: Array<blueprints.ClusterAddOn> = [
      new blueprints.addons.VpcCniAddOn(),
      new blueprints.addons.KarpenterAddOn({
        amiFamily: 'AL2',
        //version: '0.15.0',
        provisionerSpecs: {
          'karpenter.sh/capacity-type': ['spot'],
          "kubernetes.io/arch": ["amd64","arm64"],
          "topology.kubernetes.io/zone": ["eu-west-1a", "eu-west-1b"],
          //"node.kubernetes.io/instance-type": ["m6i.large", "m5.large"]
        },
        subnetTags: {
          'karpenter.sh/discovery': 'eks-lab',
        },
        securityGroupTags: {
          'kubernetes.io/cluster/eks-cluster': 'owned'
        },
      }),
      new blueprints.addons.AwsLoadBalancerControllerAddOn(),
      new blueprints.addons.CoreDnsAddOn(),
      new blueprints.addons.EfsCsiDriverAddOn(),
      new blueprints.addons.EbsCsiDriverAddOn(),
      new blueprints.addons.ExternalDnsAddOn({
        hostedZoneResources: [props.zone.zoneName],
      }),
      new blueprints.addons.KubeProxyAddOn(),
      //new blueprints.addons.MetricsServerAddOn(),
    ];

    const resourceProviders = new Map<string,blueprints.ResourceProvider<IResource>>([
      [
        blueprints.GlobalResources.Vpc,
        new blueprints.DirectVpcProvider(props.vpc),
      ],[
        props.zone.zoneName,
        new blueprints.ImportHostedZoneProvider(props.zone.hostedZoneId)
      ],
      [
        'cert',
        new blueprints.ImportCertificateProvider(props.certificateArn, 'wildcardCert')
      ]
    ]);

    new blueprints.EksBlueprint(
      this,
      {
        addOns,
        clusterProvider,
        resourceProviders,
        id: 'eks-cluster',
      },
      props
    );
  }
}

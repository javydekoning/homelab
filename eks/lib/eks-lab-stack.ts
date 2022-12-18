import { Stack, IResource, StackProps, aws_eks as eks } from "aws-cdk-lib";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { Construct } from "constructs";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { IHostedZone } from "aws-cdk-lib/aws-route53";

export interface EksLabStackProps extends StackProps {
  vpc: IVpc;
  zone: IHostedZone;
  certificateArn: string;
}

export class EksLabStack extends Stack {
  constructor(scope: Construct, id: string, props: EksLabStackProps) {
    super(scope, id, props);

    const clusterProvider = new blueprints.GenericClusterProvider({
      version: eks.KubernetesVersion.V1_23,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUDIT,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
      fargateProfiles: {
        karpenter: {
          fargateProfileName: "karpenter",
          selectors: [{ namespace: "karpenter" }],
        },
      },
    });

    const addOns: Array<blueprints.ClusterAddOn> = [
      new blueprints.addons.VpcCniAddOn(),
      new blueprints.addons.KarpenterAddOn({
        amiFamily: "AL2",
        version: "v0.20.0",
        repository: "oci://public.ecr.aws/karpenter/karpenter",
        release: "karpenter",
        chart: "karpenter",
        ttlSecondsUntilExpired: 60*60*34*7,
        requirements: [
          {
            key: "karpenter.sh/capacity-type",
            op: "In",
            vals: ["spot"],
          },
          {
            key: "kubernetes.io/arch",
            op: "In",
            vals: ["amd64", "arm64"],
          },
          {
            key: "topology.kubernetes.io/zone",
            op: "In",
            vals: ["eu-west-1a", "eu-west-1b"],
          },
        ],
        consolidation: { enabled: true },
        subnetTags: {
          "karpenter.sh/discovery": "eks-lab",
        },
        securityGroupTags: {
          "kubernetes.io/cluster/eks-cluster": "owned",
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
      new blueprints.addons.MetricsServerAddOn(),
      // # Pending fix for: https://github.com/aws-quickstart/cdk-eks-blueprints/issues/441
      // new blueprints.addons.AwsNodeTerminationHandlerAddOn(),
    ];

    const resourceProviders = new Map<
      string,
      blueprints.ResourceProvider<IResource>
    >([
      [
        blueprints.GlobalResources.Vpc,
        new blueprints.DirectVpcProvider(props.vpc),
      ],
      [
        props.zone.zoneName,
        new blueprints.ImportHostedZoneProvider(props.zone.hostedZoneId),
      ],
      [
        "cert",
        new blueprints.ImportCertificateProvider(
          props.certificateArn,
          "wildcardCert"
        ),
      ],
    ]);

    new blueprints.EksBlueprint(
      this,
      {
        addOns,
        clusterProvider,
        resourceProviders,
        id: "eks-cluster",
      },
      props
    );
  }
}

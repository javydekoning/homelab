#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_eks as eks } from "aws-cdk-lib";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { NetworkStack } from '../lib/network-stack';
import { StorageStack } from '../lib/storage-stack';
import { CertificateManagerStack } from '../lib/cert-manager-stack';

const app = new cdk.App();

const env = { account: '922457306128', region: 'eu-west-1' };

const network = new NetworkStack(app, 'eks-bp-network-stack', {
  transitGatewayId: 'tgw-0747750a334b263d5',
  env
})

const certStack = new CertificateManagerStack(app, 'eks-bp-cert-manager-stack', {
  env
})

// const storageStack = new StorageStack(app, 'eks-bp-storage-stack', {
//   vpc: network.vpc,
//   env
// })

const clusterProvider = new blueprints.GenericClusterProvider({
  version: eks.KubernetesVersion.V1_25,
  securityGroup: network.sg,
  fargateProfiles: {
    karpenter: {
      fargateProfileName: "karpenter",
      selectors: [{ namespace: "karpenter" }],
    },
  },
});

const addOns: blueprints.ClusterAddOn[] = [
  new blueprints.VpcCniAddOn(),
  new blueprints.addons.KarpenterAddOn({
    // version: "v0.27.5",
    amiFamily: "AL2",
    interruptionHandling: true,
    ttlSecondsUntilExpired: 60 * 60 * 24 * 7, // 1 week
    requirements: [
      {
        key: "karpenter.sh/capacity-type",
        op: "In",
        vals: ["spot", "on-demand"],
      },
      {
        key: "kubernetes.io/arch",
        op: "In",
        vals: ["amd64", "arm64"],
      },
      {
        key: "topology.kubernetes.io/zone",
        op: "In",
        vals: ["eu-west-1a", "eu-west-1b", "eu-west-1c"],
      },{
        key: "karpenter.k8s.aws/instance-generation",
        op: "In",
        vals: ["3","4","5","6","7"]
      }
    ],
    consolidation: { enabled: true },
    subnetTags: {
      "karpenter.sh/discovery": "eks-blueprint",
    },
    securityGroupTags: {
      "kubernetes.io/cluster/eks-blueprint": "owned",
    },
  }),
  new blueprints.addons.AwsLoadBalancerControllerAddOn(),
  new blueprints.addons.CoreDnsAddOn(),
  // new blueprints.addons.EfsCsiDriverAddOn(),
  // new blueprints.addons.EbsCsiDriverAddOn(),
  new blueprints.addons.ExternalDnsAddOn({
    hostedZoneResources: [certStack.zone.zoneName],
  }),
  new blueprints.addons.KubeProxyAddOn(),
  new blueprints.addons.MetricsServerAddOn(),
]

new blueprints.BlueprintBuilder()
  .addOns(
    ...addOns
  )
  .resourceProvider(
    blueprints.GlobalResources.Vpc,
    new blueprints.DirectVpcProvider(network.vpc)
  )
  .resourceProvider(
    certStack.zone.zoneName,
    new blueprints.ImportHostedZoneProvider(certStack.zone.hostedZoneId),
  )
  .resourceProvider(
    "cert", new blueprints.ImportCertificateProvider(
      certStack.certificateArn,
      "wildcardCert"
    ),
  )
  .clusterProvider(clusterProvider)
  .build(app, "eks-blueprint");

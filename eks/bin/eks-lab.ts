#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_eks as eks } from "aws-cdk-lib";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { NetworkStack } from '../lib/network-stack';
import { CertificateManagerStack } from '../lib/cert-manager-stack';

const app = new cdk.App();

const env = { account: '922457306128', region: 'eu-west-1' };

const network = new NetworkStack(app, 'eks-bp-demo-network-stack', {
  env
})

const certStack = new CertificateManagerStack(app, 'eks-bp-demo-cert-manager-stack', {
  env
})

const clusterProvider = new blueprints.GenericClusterProvider({
  securityGroup: network.sg,
  version: eks.KubernetesVersion.V1_30,
  fargateProfiles: {
    karpenter: {
      fargateProfileName: "karpenter",
      selectors: [{ namespace: "karpenter" }],
    },
  },
});

new blueprints.BlueprintBuilder()
  .addOns(
    new blueprints.VpcCniAddOn({
      enablePrefixDelegation: true,
      warmPrefixTarget: 1,
      enableNetworkPolicy: true,
    }),
    new blueprints.addons.KarpenterAddOn({
      version: "0.37.0",
      values: {
        //https://github.com/aws/karpenter-provider-aws/issues/5817
        dnsPolicy: "Default",
      },
      nodePoolSpec: {
        requirements: [
          {
            key: "karpenter.k8s.aws/instance-generation",
            operator: "Gt",
            values: ["3"]
          },{
            key: "karpenter.sh/capacity-type",
            operator: "In",
            values: ["spot", "on-demand"]
          },{
            key: "kubernetes.io/arch",
            operator: "In",
            values: ["arm64", "amd64"]
          }
        ]
      },
      ec2NodeClassSpec: {
        amiFamily: "Bottlerocket",
        securityGroupSelectorTerms: [{tags: {"kubernetes.io/cluster/eks-blueprint": "owned"}}],
        subnetSelectorTerms: [{tags: {"karpenter.sh/discovery": "eks-blueprint"}}]
      }
    }),

    new blueprints.addons.AwsLoadBalancerControllerAddOn(),
    new blueprints.addons.ExternalDnsAddOn({
      hostedZoneResources: [certStack.zone.zoneName],
    }),
    new blueprints.addons.KubeProxyAddOn(),
    new blueprints.addons.MetricsServerAddOn()
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
  .build(app, "eks-blueprint-demo", {env});

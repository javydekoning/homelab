#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_eks as eks } from "aws-cdk-lib";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { NetworkStack } from '../lib/network-stack';
import { StorageStack } from '../lib/storage-stack';
import { CertificateManagerStack } from '../lib/cert-manager-stack';
import { Construct } from 'constructs';

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
  version: eks.KubernetesVersion.V1_26,
  securityGroup: network.sg,
  fargateProfiles: {
    karpenter: {
      fargateProfileName: "karpenter",
      selectors: [{ namespace: "karpenter" }],
    },
  },
});

class MyKarpenterManifestsAddOn implements blueprints.ClusterAddOn {
  @blueprints.utils.dependable(blueprints.addons.KarpenterAddOn.name)
  deploy(clusterInfo: blueprints.ClusterInfo): void | Promise<Construct> {
    const cluster = clusterInfo.cluster;
    const docArray = blueprints.utils.readYamlDocument(__dirname + '/karpenter.manifests.yaml')
    const manifest = docArray.split("---").map(e => blueprints.utils.loadYaml(e));
    const karpenterManifest = new eks.KubernetesManifest(cluster.stack, "karpenter-manifests", {
      cluster,
      manifest,
      overwrite: true,
    });
    return Promise.resolve(karpenterManifest);
  }
}

new blueprints.BlueprintBuilder()
  .addOns(
    new blueprints.VpcCniAddOn(),
    new blueprints.addons.KarpenterAddOn(),
    new MyKarpenterManifestsAddOn(),
    new blueprints.addons.AwsLoadBalancerControllerAddOn(),
    new blueprints.addons.CoreDnsAddOn(),
    new blueprints.addons.ExternalDnsAddOn({
      hostedZoneResources: [certStack.zone.zoneName],
    }),
    new blueprints.addons.KubeProxyAddOn(),
    new blueprints.addons.MetricsServerAddOn(),
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

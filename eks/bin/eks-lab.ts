#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_eks as eks } from "aws-cdk-lib";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { NetworkStack } from '../lib/network-stack';
import { StorageStack } from '../lib/storage-stack';
import { CertificateManagerStack } from '../lib/cert-manager-stack';
import { Construct } from 'constructs';
import { dependable } from '@aws-quickstart/eks-blueprints/dist/utils';



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

class MyKarpenterProvisionersAddOn implements blueprints.ClusterAddOn {
  @blueprints.utils.dependable(blueprints.addons.KarpenterAddOn.name)
  deploy(clusterInfo: blueprints.ClusterInfo): void | Promise<Construct> {
    const cluster = clusterInfo.cluster;
    const docArray = blueprints.utils.readYamlDocument(__dirname + '/provisioner.default.yaml')
    const manifest = docArray.split("---").map(e => blueprints.utils.loadYaml(e));
    new eks.KubernetesManifest(cluster.stack, "karpenter-provisioner", {
      cluster,
      manifest,
      overwrite: true
    });
  }
}

const addOns: blueprints.ClusterAddOn[] = [
  new blueprints.VpcCniAddOn(),
  new blueprints.addons.KarpenterAddOn(),
  new blueprints.addons.AwsLoadBalancerControllerAddOn(),
  new blueprints.addons.CoreDnsAddOn(),
  new blueprints.addons.ExternalDnsAddOn({
    hostedZoneResources: [certStack.zone.zoneName],
  }),
  new blueprints.addons.KubeProxyAddOn(),
  new blueprints.addons.MetricsServerAddOn(),
  new MyKarpenterProvisionersAddOn()
]

new blueprints.BlueprintBuilder()
  .addOns(
    ...addOns,
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

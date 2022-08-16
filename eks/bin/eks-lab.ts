#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { StorageStack } from '../lib/storage-stack';
import { EksLabStack } from '../lib/eks-lab-stack';
import { CertificateManagerStack } from '../lib/cert-manager-stack';

const app = new cdk.App();

const env  = { account: '922457306128', region: 'eu-west-1' };

const network = new NetworkStack(app, 'network-stack', {
  transitGatewayId: 'tgw-0747750a334b263d5',
  env
})

const certStack = new CertificateManagerStack(app, 'cert-manager-stack', {
  env
})

const storageStack = new StorageStack(app, 'eks-lab-storage-stack', {
  vpc: network.vpc,
  env
})

new EksLabStack(app, 'eks-lab-stack', {
  vpc: network.vpc,
  zone: certStack.zone,
  certificateArn: certStack.certificateArn,
  env,
})
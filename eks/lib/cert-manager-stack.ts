import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_route53 as r53, aws_certificatemanager as acm } from 'aws-cdk-lib';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';

export class CertificateManagerStack extends Stack {
  zone: IHostedZone;
  certificateArn: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = r53.HostedZone.fromLookup(this, 'javydekoning.com', {
        domainName: 'javydekoning.com'
    })

    const cert = new acm.DnsValidatedCertificate(this, 'eksCert', {
      domainName: '*.javydekoning.com',
      hostedZone
    })
    this.certificateArn = cert.certificateArn
    this.zone = hostedZone
  }
}

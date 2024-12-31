# My Homelab

<div align="center">

_... Powered by_ 📦

![k8s k3s argo logos](https://raw.githubusercontent.com/javydekoning/homelab/main/docs/src/assets/logo.webp)
_... managed with [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), Ansible, Renovate, and GitHub Actions_ 🤖

</div>

## Status

<div align="center">

[![MegaLinter](https://img.shields.io/github/actions/workflow/status/javydekoning/homelab/.github/workflows/mega-linter.yml?branch=main&style=flat&logo=GitHub&logoColor=white&label=Linter)](https://github.com/javydekoning/homelab/actions?query=workflow%3AMegaLinter+branch%3Amain)
[![Kubernetes](https://kromgo.lab.javydekoning.com/kubernetes_version?format=badge)](https://kubernetes.io)
[![zfs](https://kromgo.lab.javydekoning.com/zfs_health?format=badge)](https://kubernetes.io)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=Ubiquiti&logoColor=white&label=Uptime%20(30%20days))
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=plex&logoColor=white&label=Plex)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=jellyfin&logoColor=white&label=Jellyfin)
</div>

## Setup

Today is automated via Ansible. Make sure to:
- Set node IP in `inventory`.
- Enable ssh key auth using `ssh-copy-id root@<ip>`

To kick of the configuration:

```sh
ansible-playbook play.yml
```

## Bootstrap "External Secrets" secret

Create an IAM user with the following policy attached:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Get",
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:*:012345678912:secret:k8s*"
    },
    {
      "Sid": "List",
      "Effect": "Allow",
      "Action": "secretsmanager:ListSecrets",
      "Resource": "*"
    }
  ]
}
```

This gives access to secrets prefixed with `k8s`. Your secrets can now be stored
in AWS Secrets Manager.

```sh
# To bootstrap, we add AWS credentials via one secret:
kubectl create secret generic awssm-secret -n external-secrets \
  --from-literal=access-key=$ACCESS_KEY --from-literal=secret-access-key=$SECRET_KEY
```

Today, [cert-manager](https://cert-manager.io/) and
[ddns-route53](https://crazymax.dev/ddns-route53/) rely on a secret in AWS
Secrets Manager in the following format:

```json
{
  "HOSTED_ZONE_ID": "<>",
  "RECORD_NAME": "<>",
  "AWS_ACCESS_KEY_ID": "<>",
  "AWS_SECRET_ACCESS_KEY": "<>",
  "AWS_DEFAULT_REGION": "eu-west-1"
}
```

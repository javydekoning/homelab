# My Homelab

<div align="center">

_... Powered by_ 📦

![k8s k3s argo logos](https://raw.githubusercontent.com/javydekoning/homelab/main/docs/src/assets/logo.webp)
_... managed with [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), Truenas, Renovate, and GitHub Actions_ 🤖

</div>

## Status

<div align="center">

[![MegaLinter](https://img.shields.io/github/actions/workflow/status/javydekoning/homelab/.github/workflows/mega-linter.yml?branch=main&style=flat&logo=GitHub&logoColor=white&label=Linter)](https://github.com/javydekoning/homelab/actions?query=workflow%3AMegaLinter+branch%3Amain)
[![Kubernetes](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.lab.javydekoning.com%2Fkubernetes_version&style=for-the-badge&logo=kubernetes&logoColor=white&color=blue&style=flat&label=Kubernetes)](https://kubernetes.io)
[![Truenas zpool main](https://img.shields.io/endpoint?url=https%3A%2F%2Fkromgo.lab.javydekoning.com%2Fzfs_health&style=for-the-badge&logo=truenas&logoColor=white&color=blue&style=flat&label=Truenas%20zpool%20main)](https://kubernetes.io)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=Ubiquiti&logoColor=white&label=Uptime%20(30%20days))
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=plex&logoColor=white&label=Plex)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=jellyfin&logoColor=white&label=Jellyfin)
</div>

## Setup

Today is automated via Jailmaker. Bootstrap script can be found in `truenas/k3s-jail-config`.

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
      "Resource": "arn:aws:secretsmanager:*:<AWS account id>:secret:k8s*"
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
printf "%s" "Enter ACCESS_KEY: "
read ACCESS_KEY

printf "%s" "Enter SECRET_KEY: "
read SECRET_KEY

kubectl create ns external-secrets
kubectl create secret generic awssm-secret -n external-secrets \
  --from-literal=access-key=$ACCESS_KEY --from-literal=secret-access-key=$SECRET_KEY
```

Multiple services like Cert-Manager and DDNS rely on external secrets that are bootstrapped via the above.

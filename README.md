## My Homelab

<div align="center">

_... Powered by_ 📦

<img src="https://raw.githubusercontent.com/javydekoning/homelab/main/docs/src/assets/logo.webp" align="center"/>

_... managed with [ArgoCD](https://argo-cd.readthedocs.io/en/stable/), Ansible, Renovate, and GitHub Actions_ 🤖

</div>

## CI/CD

<div align="center">

[![MegaLinter](https://github.com/javydekoning/homelab/workflows/MegaLinter/badge.svg?branch=main)](https://github.com/javydekoning/homelab/actions?query=workflow%3AMegaLinter+branch%3Amain)&nbsp;&nbsp;
![GitHub Release](https://img.shields.io/github/v/release/k3s-io/k3s?style=flat&logo=github&logoColor=white&label=Kubernetes)&nbsp;&nbsp;

</div>

## Monitoring

<div align="center">

![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=Ubiquiti&logoColor=white&label=Uptime%20(30%20days))&nbsp;&nbsp;
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=plex&logoColor=white&label=Plex)&nbsp;&nbsp;
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m796359034-bf4a20fb15ecb491d5f31727?style=flat&logo=jellyfin&logoColor=white&label=Jellyfin)&nbsp;&nbsp;
</div>

## Setup

Today is automated via Ansible. Make sure to:
- Set correct IP in `inventory`.
- Enable ssh key auth using `ssh-copy-id root@<ip>`

To kick of the configuration:

```sh
ansible-playbook play.yml
```

## ToDo (Not yet automated)

Deploy `ClusterIssuer`, `Certificate` and `Secret` for cert-manager.

```sh
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY_BASE64=$(echo 'yoursecretgoeshere' | base64)
export AWS_R53_ZONE_ID=
envsubst < ./k8s/cluster-critical/cert-manager-issuer/custom.yaml | kubectl apply -f -
```

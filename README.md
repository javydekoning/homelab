# My Homelab

[![MegaLinter](https://github.com/javydekoning/homelab/workflows/MegaLinter/badge.svg?branch=main)](https://github.com/javydekoning/homelab/actions?query=workflow%3AMegaLinter+branch%3Amain)

My Homelab!

## Setup

Today is automated via Ansible. Make sure to:
- Set correct IP in `inventory`.
- Enable ssh key auth using `ssh-copy-id root@<ip>`

To kick of the configuration:

```sh
ansible-playbook play.yml
```

## ToDo (Not yet automated)

- Automated deployment of Intel NFD Rules:
  - `kubectl apply -k 'https://github.com/intel/intel-device-plugins-for-kubernetes/deployments/nfd/overlays/node-feature-rules?ref=v0.26.0'`
  - See [this issue](https://github.com/intel/helm-charts/issues/31)
- Deploy Secret for cert-manager (`k8s/cluster-critical/cert-manager-issuer`)

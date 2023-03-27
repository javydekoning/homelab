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

Deploy `ClusterIssuer`, `Certificate` and `Secret` for cert-manager.

```sh
export AWS_ACCESS_KEY=
export AWS_SECRET_ACCESS_KEY_BASE64=$(echo 'yoursecretgoeshere' | base64)
export AWS_R53_ZONE_ID=
envsubst < ./k8s/cluster-critical/cert-manager-issuer/custom.yaml | kubectl apply -f -
```

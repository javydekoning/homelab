# My Homelab

[![MegaLinter](https://github.com/javydekoning/homelab/workflows/MegaLinter/badge.svg?branch=main)](https://github.com/javydekoning/homelab/actions?query=workflow%3AMegaLinter+branch%3Amain)

My Homelab! All running on an old, low power N3150!

![Screenshot of running apps.](homelab.png)

## Setup

Today is automated via Ansible. Make sure to:
- Set correct IP in `inventory`.
- Enable ssh key auth using `ssh-copy-id root@<ip>`

To kick of the configuration:

```sh
ansible-playbook play.yml
```

## Todo

- [ ] New hardware.
  - [ ] Needs Intel Quick Sync Video (QSV) for HW transcoding.
  - [ ] Odroid H3(+). With:
    - [ ] 2TB NVME
    - [ ] 32GB (2x16GB)
    - [ ] SATA + PowerCable
    - [ ] DC Adapter
    - [ ] Case (Type 3 for HDD? Or will 2TB suffice?)

## Notes

To deploy helm charts manually

```sh
cd <cluster-apps/name>
helm dependency build
helm install -f values.yaml <name> ./
```

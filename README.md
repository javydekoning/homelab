# Homelab

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

- [ ] Leverage `MixedProtocolLBService`. Beta since Kubernetes `1.24`.
  - [X] Pending move to beta. [MixedProtocolLBService](https://github.com/kubernetes/enhancements/issues/1435)
  - [X] Pending [metallb/issues/1050](https://github.com/metallb/metallb/issues/1050)
- [ ] New hardware.
  - [ ] Needs Intel Quick Sync Video (QSV) for HW transcoding.
  - [ ] Odroid H3+ ?
- [x] Make Plex wait for Intel
  - `gpu.intel.com/i915: "1"`

## Notes

To deploy helm charts manually

```sh
cd <cluster-apps/name>
helm dependency build
helm install -f values.yaml <name> ./
```

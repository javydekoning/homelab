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

- [ ] Fix automated Ansible Shell change. Today this doesn't work on Alipine.
  - [ ] Pending [ansible/issues/61911](https://github.com/ansible/ansible/issues/61911)
- [ ] Leverage `MixedProtocolLBService`. Beta since Kubernetes `1.24`.
  - [X] Pending move to beta. [MixedProtocolLBService](https://github.com/kubernetes/enhancements/issues/1435)
  - [X] Pending [metallb/issues/1050](https://github.com/metallb/metallb/issues/1050)
- [ ] New hardware.
  - [ ] Needs Intel Quick Sync Video (QSV) for HW transcoding.
  - [ ] 11th gen i5 or better (UHD 770 or Xe Graphics).
- [ ] Consider moving to Truenas Scale for ZFS benefits + Kubernetes support.
  - [ ] Not an option today, Truenas Scale runs Linux kernel 5.10 which doesn't fully support Intel Gen 11/12. Bluefin will move Kernel to 5.15.

**Automation:**

- [ ] Make Plex wait for Intel Daemon set (via init container?)
- [ ] Setup TLS
  - https://traefik.io/blog/traefik-proxy-kubernetes-101/
  - https://sysadmins.co.za/https-using-letsencrypt-and-traefik-with-k3s/

## Completed fixes for future reference

1. Ensure Traefik can connect to insecure backends for Unifi and Argo. As we terminate TLS at Traefik.
  - https://rancher.com/docs/k3s/latest/en/helm/#customizing-packaged-components-with-helmchartconfig
  - https://github.com/traefik/traefik-helm-chart/blob/master/traefik/values.yaml

```yaml
apiVersion: helm.cattle.io/v1
kind: HelmChartConfig
metadata:
  name: traefik
  namespace: kube-system
spec:
  valuesContent: |-
    globalArguments:
    - "--serversTransport.insecureSkipVerify=true"
```

View [ServersTransport for Argo to see how it was fixed](/k8s/cluster-apps/argocd/custom.yaml)

## Notes

To deploy helm charts manually

```sh
cd <cluster-apps/name>
helm dependency build
helm install -f values.yaml <name> ./
```

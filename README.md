# Homelab

## Todo

**Automation:**

- [ ] Add init container to Plex which waits for Intel driver to be ready
- [ ] Setup TLS 
  - https://traefik.io/blog/traefik-proxy-kubernetes-101/
  - https://sysadmins.co.za/https-using-letsencrypt-and-traefik-with-k3s/

## In progress

- [x] Change Traefik to accept insecure backend for unifi/argo.
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

- [x] Automate creation of ArgoCD web UI ingress
  - https://argo-cd.readthedocs.io/en/stable/operator-manual/ingress/#traefik-v22

```
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: argocd-server
  namespace: argocd
spec:
  entryPoints:
    - websecure
  routes:
    - kind: Rule
      match: Host(`argocd.k8s.javydekoning.com`)
      services:
        - name: argocd-server
          namespace: argocd
          port: https
```

**Future improvements:**

- [ ] Fix Ansible Shell change. Pending [ansible/issues/61911](https://github.com/ansible/ansible/issues/61911)
- [ ] Leverage `https://github.com/metallb/metallb/issues/1050`. Pending [metallb/issues/1050](https://github.com/metallb/metallb/issues/1050)
- [ ] New hardware :-).

## Setup

Automated via Ansible. Make sure to:
- set correct IP in `inventory`. 
- enable ssh key auth using `ssh-copy-id root@<ip>` 

To kick of the configuration:

```sh
ansible-playbook play.yml
```

## Deploy helm charts manually

```sh
cd <cluster-apps/name>
helm dependency build
helm install -f values.yaml <name> ./
```

## Argo Applicationset

Deploy it manually for now

```sh
kubectl apply -f application-set.yaml -n argocd
```
# Homelab

## Todo

**Automation:**

- [ ] Test Argo Deployments
- [ ] Move to Ansible Roles 

**Critical infra:**

- [ ] Unifi controller
- [ ] AdGuard home or Pi-hole

**Cluster Monitoring:**
- [ ] Grafana
- [ ] Loki
- [ ] Prometheus
- [ ] Promtail

**Cluster apps:**

- [ ] Plex 

**Future improvements:**

- [ ] Fix Ansible Shell change. Pending [ansible/issues/61911](https://github.com/ansible/ansible/issues/61911)
- [ ] Leverage `https://github.com/metallb/metallb/issues/1050`. Pending [metallb/issues/1050](https://github.com/metallb/metallb/issues/1050)

## Setup

Automated via Ansible. Make sure to:
- set correct IP in `inventory`. 
- enable ssh key auth using `ssh-copy-id root@<ip>` 

To kick of the configuration:

```sh
ansible-playbook play.yml
```

Test:

```sh
k3s kubectl create deployment test --image nginx
k3s kubectl expose deployment test --type LoadBalancer --port 80

curl 192.168.1.200
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

All done!

## SOPS

Secrets in this repo are protected using SOPS. I've run into an error where SOPS is unable to decrypt on my Mac,
this was fixed using:

```sh
GPG_TTY=$(tty)
export GPG_TTY
```

See: [this GitHub issue](https://github.com/mozilla/sops/issues/304)

### Encrypt & Decrypt instructions

Encrypt:

```sh
sops --encrypt --encrypted-suffix '_encrypted' folder/file.yml >> folder/file_decrypted.yml
```

Decrypt:
```
sops --decrypt --encrypted-suffix '_encrypted' aws/template.yml | sed -r 's/_encrypted//'
```
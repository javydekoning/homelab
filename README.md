# Homelab

## Todo

**Automation:**

- [ ] Move to Ansible Roles 

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

## Deploy helm charts manually

```sh
cd <cluster-apps/name>
helm dependency build
helm install -f values.yaml <name> ./
```
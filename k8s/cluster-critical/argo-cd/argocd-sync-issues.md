# ArgoCD Sync Issues Runbook

## Alert: ArgoCDApplicationOutOfSync

**Severity:** Warning
**Alert Condition:** `argocd_app_info{sync_status!="Synced"}`
**Alert Duration:** 5 minutes

---

## Overview

This alert fires when one or more ArgoCD applications have a sync status other than "Synced" for more than 5 minutes. This indicates that the desired state (Git repository) doesn't match the actual state in the Kubernetes cluster.

## Common Sync Statuses

- **OutOfSync**: Resources in cluster differ from Git
- **Unknown**: ArgoCD cannot determine sync status
- **Synced**: Everything matches (this is the desired state)

---

## Initial Response (First 5 minutes)

### 1. Identify Affected Applications

Access the ArgoCD UI or use CLI to identify which applications are affected:

```bash
# List all applications with their sync status
argocd app list

# Get specific application details
argocd app get <application-name>

# Or check via kubectl
kubectl get applications -n argocd -o wide
```

### 2. Check ArgoCD UI

1. Open ArgoCD web interface: `https://argocd.k8s.javydekoning.com/`
2. Look for applications with red/yellow status indicators
3. Click on the affected application(s) to see detailed diff view

### 3. Quick Health Check

Verify ArgoCD components are healthy:

```bash
# Check ArgoCD pods
kubectl get pods -n argocd

# Check ArgoCD server logs
kubectl logs -n argocd deployment/argocd-server

# Check application controller logs
kubectl logs -n argocd deployment/argocd-application-controller
```

### 4. Fix the issue

Search, fix and update this runbook :D.

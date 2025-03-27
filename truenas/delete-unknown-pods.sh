#!/bin/bash
kubectl get pods --all-namespaces -o json | jq -r '.items[] | select(.status.containerStatuses[].state.terminated.reason=="Unknown") | [.metadata.namespace, .metadata.name] | @tsv' | while read namespace name; do
  kubectl delete pod $name -n $namespace
done

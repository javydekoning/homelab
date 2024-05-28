# Load generator example

Deploy the kustomization

```sh
kubectl apply -k karpenter-demo/hpa-demo/
```

To generate load, run one or more `wget` loops

```sh
# Run this in a separate terminal
# so that the load generation continues and you can carry on with the rest of the steps
# kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
kubectl run load-gen1 --image=busybox:1.28 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://php-apache > /dev/null; done"
kubectl run load-gen2 --image=busybox:1.28 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://php-apache > /dev/null; done"
# Or interactive
kubectl run -i --tty load-gen2 --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://php-apache; done"
kubectl run -i --tty load-gen3 --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://php-apache; done"
```

In another window, split tmux in 3 horizontal panes and showcase the impact using:

```sh
k9s
eks-node-viewer
k get hpa --watch
```

Which would yield this result:

![alt text](image.png)

## Notes

https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/853-configurable-hpa-scale-velocity/README.md#story-2-scale-up-as-fast-as-possible-scale-down-very-gradually


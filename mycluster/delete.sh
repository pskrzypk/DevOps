kubectl delete service mypostgres-clusterip
kubectl delete service myredisservice
kubectl delete service mybackendlb-node-port

kubectl delete service mybackendlb-clusterip
kubectl delete service mypostgres-clusterip

kubectl delete configMaps --all
kubectl delete deployments --all
kubectl delete pods --all
kubectl delete ingresses --all
kubectl delete pvc postgres-pvc
kubectl delete pv pv-local
kubectl delete secret myapp-secret

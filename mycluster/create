Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

kubectl create -f myredis-service-clusterip.yml
kubectl create -f myredis-deployment.yml

kubectl apply -f postgres-secret.yml
kubectl apply -f postgres-configMap.yml
kubectl apply -f pv-local.yml
kubectl apply -f postgres-pvc.yml
kubectl apply -f postgres-deployment.yml
kubectl apply -f postgres-clusterip.yml

kubectl apply -f mybackendlb-clusterip.yaml
kubectl apply -f mybackendlb-node-port.yaml
kubectl apply -f mybackendlb-deployment.yaml

kubectl get deploy
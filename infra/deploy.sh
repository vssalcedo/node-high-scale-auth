terraform apply
doctl kubernetes cluster kubeconfig save concurrent-login-cluster
kubectl create secret docker-registry gcr-pull-secret \
  --docker-server=us-central1-docker.pkg.dev \
  --docker-username=_json_key \
  --docker-password="$(cat concurrent-login-docker-images-key.json)" \
  --namespace=default
kubectl create configmap envoy-config --from-file=k8s/envoy.yaml
kubectl apply -f k8s/.
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Install signoz
helm repo add signoz https://charts.signoz.io
helm repo update
kubectl create namespace signoz
helm install signoz signoz/signoz -n signoz --set frontend.service.type=ClusterIP

kubectl rollout restart deployment api hasher

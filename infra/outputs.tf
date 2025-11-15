output "cluster_name" {
  value = digitalocean_kubernetes_cluster.main.name
}

output "cluster_endpoint" {
  value = digitalocean_kubernetes_cluster.main.endpoint
}

output "cluster_ca_certificate" {
  value = digitalocean_kubernetes_cluster.main.kube_config[0].cluster_ca_certificate
  sensitive = true
}

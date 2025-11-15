terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.67.0"
    }
  }
  required_version = ">= 1.5.0"
}

provider "digitalocean" {
  token = var.do_token
}

// Principal DOKS resource. The first 'node_pool' acts as the 'api-pool'.
resource "digitalocean_kubernetes_cluster" "main" {
  name    = "concurrent-login-cluster"
  region  = var.region
  version = "1.33.1-do.4" 

  // This is the 'api-pool' fixed size (min=1, max=1)
  node_pool {
    name       = "api-pool"
    size       = var.api_instance_type
    auto_scale = true
    min_nodes  = 1
    max_nodes  = 5
  }
}

resource "digitalocean_kubernetes_node_pool" "hashing_pool" {
  cluster_id = digitalocean_kubernetes_cluster.main.id
  name       = "hashing-pool"
  
  size       = var.hashing_instance_type

  auto_scale = true
  min_nodes  = var.min_hashing_nodes
  max_nodes  = var.max_hashing_nodes
}

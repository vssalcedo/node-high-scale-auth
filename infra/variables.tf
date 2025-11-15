
variable "region" {
  description = "DigitalOcean Region"
  type        = string
  default     = "nyc1"
}

variable "do_token" {
  description = "DigitalOcean Token"
  type        = string
  sensitive = true
}

variable "api_instance_type" {
  description = "Machine type for the API node pool"
  type        = string
  default     = "s-4vcpu-8gb"
}

variable "hashing_instance_type" {
  description = "Machine type for the Hashing Workers"
  type        = string
  default     = "s-8vcpu-16gb"
}

variable "max_hashing_nodes" {
  description = "Maximum number of hashing nodes"
  type        = number
  default     = 19
}

variable "min_hashing_nodes" {
  description = "Minimum number of hashing nodes"
  type        = number
  default     = 1
}

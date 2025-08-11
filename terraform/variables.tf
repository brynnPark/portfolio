
# Project Specific Variables
variable "static_bucket_name" {
  type        = string
  description = "The name of S3 bucket for static website hosting"
  default = "brynnpark-web"
}

// Create a variable for our domain name because we'll be using it a lot.
variable "www_domain_name" {
  default = "www.brynnpark.xyz"
}

// We'll also need the root domain (also known as zone apex or naked domain).
variable "root_domain_name" {
  default = "brynnpark.xyz"
}
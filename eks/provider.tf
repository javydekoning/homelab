provider "aws" {
    region = "eu-west-1"
}

provider "eks" { }

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.8"
    }
    kubectl = {
      source  = "alekc/kubectl"
      version = ">= 2.1"
    }
    external = {
      source = "registry.opentofu.org/hashicorp/external"
    }
  }
}

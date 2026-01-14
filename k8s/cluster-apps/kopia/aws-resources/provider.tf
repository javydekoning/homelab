terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.8.0"
    }
  }
}

provider "random" {}

provider "aws" {
  region = "eu-west-1"
}

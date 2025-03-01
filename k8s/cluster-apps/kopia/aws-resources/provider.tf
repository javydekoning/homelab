terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      # 5.x but less than 6.0.
      version = "~> 5.0"
    }

    random = {
      source = "hashicorp/random"
      version = "3.7.1"
    }
  }
}

provider "random" {}

provider "aws" {
  region = "eu-west-1"
}

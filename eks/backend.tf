terraform {
  backend "s3" {
    bucket  = "javydekoning"
    key     = "auto-mode-demo.tf"
    region  = "eu-west-1"
  }
}

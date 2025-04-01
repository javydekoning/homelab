locals {
  project_name    = "auto-mode-demo"
  cluster_version = "1.32"
  aws_region      = "eu-west-1"

  vpc_cidr = "10.70.0.0/16"
  azs      = slice(data.aws_availability_zones.available.names, 0, 3)

  tags = {
    Project    = local.project_name
  }
}

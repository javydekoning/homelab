data "aws_availability_zones" "available" {
  # Exclude local zones
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = local.project_name
  cidr = local.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]
  intra_subnets   = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 52)]

  enable_nat_gateway = true
  single_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }

  tags = local.tags
}

data "aws_networkmanager_global_networks" "javy-global-net" {
  tags = {
    Name = "javy-global-net"
  }
}

data "external" "core_network_javy-core-net" {
  program = [
              "aws",
              "--output",
              "json",
              "networkmanager",
              "list-core-networks",
              "--query",
              "{CoreNetworkId: CoreNetworks[?Tags[?Key=='Name' && Value=='javy-core-net']] | [0].CoreNetworkId, CoreNetworkArn: CoreNetworks[?Tags[?Key=='Name' && Value=='javy-core-net']] | [0].CoreNetworkArn}"
            ]
}

resource "aws_networkmanager_vpc_attachment" "javy-global-net-attachment" {
  core_network_id = data.external.core_network_javy-core-net.result.CoreNetworkId
  subnet_arns     = module.vpc.intra_subnet_arns
  vpc_arn         = module.vpc.vpc_arn
  tags = {
    Name = "eks-homelab-extension"
    Segment = "VPCSegment"
  }
}

resource "aws_route" "rtb_routes" {
  for_each = toset(
    concat(
      module.vpc.intra_route_table_ids,
      module.vpc.public_route_table_ids,
      module.vpc.private_route_table_ids
    )
  )

  route_table_id = each.value
  destination_cidr_block = "192.168.0.0/16"
  core_network_arn = data.external.core_network_javy-core-net.result.CoreNetworkArn
}

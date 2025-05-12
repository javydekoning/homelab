terraform {
  backend "s3" {
    bucket = "${var.backend_bucket_name}"
    key    = "terraform/${var.project_name}/terraform.tfstate"
    region = "${var.aws_region}"
    // todo add locking, waiting for opentofu support
  }
}

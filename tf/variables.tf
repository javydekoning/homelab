// declare variable aws_region, default to eu-west-1
variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "eu-west-1"
}

// declare variable aws_profile
variable "project_name" {
  type        = string
  description = "The name of the project. Used as a prefix for resources"
  default     = "javydekoning"
}

variable "backend_bucket_name" {
  type        = string
  description = "The name of the backend bucket"
  default     = "javydekoning"
}

variable "backup_bucket_name" {
  type        = string
  description = "The name of the s3 bucket used to store backups"
  default     = "javydekoning-homelab-backup"
}

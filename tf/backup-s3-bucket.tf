// s3 bucket for storing backups
resource "aws_s3_bucket" "backup-bucket" {
  bucket = "${var.backup_bucket_name}"
}

resource "aws_s3_bucket_versioning" "backup-bucket-versioning" {
  bucket = "${aws_s3_bucket.backup-bucket.id}"
  versioning_configuration {
    status = "false"
  }
}

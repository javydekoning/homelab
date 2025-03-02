# Attempt to create the secret
resource "aws_secretsmanager_secret" "k8s-kopia-credentials" {
  #ts:skip=AC_AWS_0500 We're intentionally not using KMS encryption for this secret in homelab environment
  name = "k8s-kopia-credentials"

  lifecycle {
    # Prevent Terraform from destroying the secret
    prevent_destroy = true

    # This makes the creation idempotent - if it already exists,
    # the apply will continue without error
    ignore_changes = [
      name,
      description,
      kms_key_id,
      tags,
    ]
  }
}

# Generate random password
resource "random_password" "kopia_password" {
  length           = 16
  special          = true
  override_special = "!-_"
}

# Create/update secret version
resource "aws_secretsmanager_secret_version" "k8s-kopia-credentials-data" {
  secret_id = aws_secretsmanager_secret.k8s-kopia-credentials.id
  secret_string = jsonencode({
    KOPIA_USER                     = "javy"
    KOPIA_PASSWORD                 = random_password.kopia_password.result
    KOPIA_BUCKET                   = aws_s3_bucket.backup_bucket.id
    KOPIA_BUCKET_ACCESS_KEY_ID     = aws_iam_access_key.backup_user_access_key.id
    KOPIA_BUCKET_SECRET_ACCESS_KEY = aws_iam_access_key.backup_user_access_key.secret
  })
}

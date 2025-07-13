resource "aws_secretsmanager_secret" "homelab_k8s" {
  name                    = "homelab-k8s"
  description             = "Homelab Kubernetes configuration secrets"
  recovery_window_in_days = 7
}

# Only create place-holder. Enter secrets via console
resource "aws_secretsmanager_secret_version" "homelab_k8s" {
  secret_id = aws_secretsmanager_secret.homelab_k8s.id
  secret_string = jsonencode({
    KOPIA_BUCKET:""
    KOPIA_BUCKET_ACCESS_KEY_ID:""
    KOPIA_BUCKET_SECRET_ACCESS_KEY:""
    KOPIA_PASSWORD:""
    KOPIA_USER:""
    FRIGATE_RTSP_BABYCAM_IP:""
    FRIGATE_RTSP_USER:"frigate"
    FRIGATE_RTSP_PASSWORD:""
    # telegram token
    token.txt:""
  })

  # Prevent Terraform from overwriting manually updated values
  lifecycle {
    ignore_changes = [secret_string]
  }
}

# Data source to read the secret values for use in other resources
data "aws_secretsmanager_secret_version" "homelab_k8s" {
  secret_id = aws_secretsmanager_secret.homelab_k8s.id
}

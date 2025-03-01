# IAM Group
resource "aws_iam_group" "backup_group" {
  name = "homelab-s3-iam-group"
}

# IAM Policy
resource "aws_iam_policy" "backup_policy" {
  name = "homelab-s3-iam-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject*",
          "s3:GetBucket*",
          "s3:List*",
          "s3:DeleteObject*",
          "s3:PutObject",
          "s3:PutObjectLegalHold",
          "s3:PutObjectRetention",
          "s3:PutObjectTagging",
          "s3:PutObjectVersionTagging",
          "s3:Abort*"
        ]
        Resource = [
          aws_s3_bucket.backup_bucket.arn,
          "${aws_s3_bucket.backup_bucket.arn}/*"
        ]
      }
    ]
  })
}

# Attach policy to group
resource "aws_iam_group_policy_attachment" "backup_policy_attachment" {
  group      = aws_iam_group.backup_group.name
  policy_arn = aws_iam_policy.backup_policy.arn
}

# IAM User
resource "aws_iam_user" "backup_user" {
  name = "homelab-s3-backup_user"
}

# Add user to group
resource "aws_iam_user_group_membership" "backup_user_membership" {
  user   = aws_iam_user.backup_user.name
  groups = [aws_iam_group.backup_group.name]
}

resource "aws_iam_access_key" "backup_user_access_key" {
  user = aws_iam_user.backup_user.name
}

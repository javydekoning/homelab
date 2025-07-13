# Create the public hosted zone
resource "aws_route53_zone" "javydekoning_com" {
  name = "javydekoning.com"
}

# MX records for improvmx
resource "aws_route53_record" "mx" {
  zone_id = aws_route53_zone.javydekoning_com.zone_id
  name    = "javydekoning.com"
  type    = "MX"
  ttl     = 60
  records = [
    "10 mx1.improvmx.com",
    "20 mx2.improvmx.com"
  ]
}

# SPF TXT record
resource "aws_route53_record" "spf" {
  zone_id = aws_route53_zone.javydekoning_com.zone_id
  name    = "javydekoning.com"
  type    = "TXT"
  ttl     = 60
  records = ["v=spf1 include:spf.improvmx.com ~all"]
}

# A record for local nginx-ingress *.k8s.javydekoning.com
resource "aws_route53_record" "k8s_wildcard" {
  zone_id = aws_route53_zone.javydekoning_com.zone_id
  name    = "*.k8s.javydekoning.com"
  type    = "A"
  ttl     = 60
  records = ["192.168.1.200"]
}

# A record for public *.lab.javydekoning.com (using secret value)
resource "aws_route53_record" "lab_wildcard" {
  zone_id = aws_route53_zone.javydekoning_com.zone_id
  name    = "*.lab.javydekoning.com"
  type    = "A"
  ttl     = 60
  #records = [local.homelab_secrets.MY_IP]
}

# A record for wg.javydekoning.com (using secret value)
resource "aws_route53_record" "wg" {
  zone_id = aws_route53_zone.javydekoning_com.zone_id
  name    = "wg.javydekoning.com"
  type    = "A"
  ttl     = 60
  #records = [local.homelab_secrets.MY_IP]
}

#!/usr/bin/bash
set -euo pipefail
apt-get update && apt-get install curl jq git zsh python3-pip unzip -y

# Install terraform
wget https://releases.hashicorp.com/terraform/1.11.0/terraform_1.11.0_linux_amd64.zip
unzip terraform_1.11.0_linux_amd64.zip
chmod a+x /usr/bin/terraform

# Configure git
git config --global user.email "javydekoning+github@gmail.com"
git config --global user.name "Javy de Koning

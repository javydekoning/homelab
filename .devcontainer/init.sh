#!/bin/bash
set -euo pipefail

sudo apt-get update && sudo apt-get install curl jq git zsh python3-pip unzip -y

# Install terraform
cd /tmp
# get latest version from https://github.com/hashicorp/terraform/releases
LATEST_VERSION=$(curl -s https://api.github.com/repos/hashicorp/terraform/releases/latest | jq -r '.tag_name')
# strip leading 'v' from LATEST_VERSION
LATEST_VERSION=${LATEST_VERSION#v}
# download, move to /usr/bin, make executable
wget https://releases.hashicorp.com/terraform/${LATEST_VERSION}/terraform_${LATEST_VERSION}_linux_amd64.zip
unzip -o terraform_${LATEST_VERSION}_linux_amd64.zip
sudo mv terraform /usr/bin/
sudo chmod a+x /usr/bin/terraform

# Configure git
git config --global user.email "javydekoning+github@gmail.com"
git config --global user.name "Javy de Koning"

# install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

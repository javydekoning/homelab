#!/bin/bash
set -euo pipefail

sudo apt-get update && sudo apt-get install zsh python3-pip -y

# Setup zsh, dotfiles, kubecolor
cd dotfiles

# Install kubecolor
bash install_kubecolor.sh

# Install dotfiles
bash install.sh

# Configure git
git config --global core.autocrlf false

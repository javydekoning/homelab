#!/bin/bash
set -euo pipefail

sudo apt-get update && sudo apt-get install zsh python3-pip -y

# Setup zsh from dotfiles
cd dotfiles
./install.sh

# Configure git
git config --global core.autocrlf false

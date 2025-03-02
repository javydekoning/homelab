#!/bin/bash
set -e

# Check if Ansible is installed
if ! command -v ansible &>/dev/null; then
  echo "Ansible is not installed. Installing..."
  if command -v apt-get &>/dev/null; then
    sudo apt-get update
    sudo apt-get install -y ansible
  elif command -v yum &>/dev/null; then
    sudo yum install -y ansible
  elif command -v brew &>/dev/null; then
    brew install ansible
  else
    echo "Could not determine package manager. Please install Ansible manually."
    exit 1
  fi
fi

# Run the Ansible playbook
echo "Installing dotfiles..."
ansible-playbook -i localhost, -c local install_dotfiles.yml

echo "Dotfiles installation complete!"
echo "Please restart your shell or run 'source ~/.zshrc' to apply changes."

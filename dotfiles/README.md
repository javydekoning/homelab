# Dotfiles

This repository contains my personal dotfiles and an Ansible playbook to install them.

## Files Included

- `.zshrc` - ZSH configuration
- `.vimrc` - Vim configuration
- `.tmux.conf` - Tmux configuration
- `.p10k.zsh` - Powerlevel10k ZSH theme configuration
- `aliases.zsh` - Custom ZSH aliases

## Prerequisites

The installation script will attempt to install Ansible if it's not already installed.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/javydekoning/javydekoning/homelab.git
   cd dotfiles
   ```

2. Make the installation script executable:

   ```bash
   chmod +x install.sh
   ```

3. Run the installation script:

   ```bash
   ./install.sh
   ```

## What the Installation Does

The Ansible playbook will:

1. Install required packages (git, zsh, curl, vim, tmux)
2. Install Oh My Zsh if not already installed
3. Install Powerlevel10k theme for ZSH
4. Install ZSH autosuggestions plugin
5. Create symlinks for all dotfiles in your home directory
6. Set ZSH as your default shell

## Manual Installation

If you prefer to run the Ansible playbook directly:

```bash
ansible-playbook -i localhost, -c local install_dotfiles.yml
```

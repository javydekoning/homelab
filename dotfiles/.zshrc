# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/usr/share/oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="candy"
ENABLE_CORRECTION="false"

# Uncomment the following line to display red dots whilst waiting for completion
COMPLETION_WAITING_DOTS="true"

# Plugins to use.
plugins=(
  git
  brew
  kubectl
  helm
)

# Disable OMZ auto update, OMZ installed via APK
zstyle ':omz:update' mode disabled
source $ZSH/oh-my-zsh.sh

#aliases
alias shutdown=poweroff
alias kubectl=kubecolor
alias k=kubecolor
alias kgp='kubectl get pods --sort-by=.metadata.creationTimestamp -A'

# Kubectl completion
autoload -U compinit
compinit

source <(kubectl completion zsh)
compdef kubecolor=kubectl

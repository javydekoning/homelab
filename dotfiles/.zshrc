# Path to your oh-my-zsh installation.
export ZSH="/root/.oh-my-zsh"

# If antigen is installed, source it.
ANTIGEN_PATH="/usr/share/zsh-antigen/antigen.zsh"

if [ -f "$ANTIGEN_PATH" ]; then
    source "$ANTIGEN_PATH"
fi

# Add plugin
antigen bundle zsh-users/zsh-autosuggestions
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
  kubectl  # https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/kubectl
  helm
  zsh-autosuggestions
)

# Disable OMZ auto update, OMZ installed via APK
zstyle ':omz:update' mode disabled
source $ZSH/oh-my-zsh.sh

# Kubectl completion
autoload -U compinit
compinit

source <(kubectl completion zsh)

# Aliases
alias shutdown=poweroff
alias gitconfig='
    git config --global user.email "javydekoning+github@gmail.com" &&
    git config --global user.name "javydekoning"
'
alias gs='git status'
alias gcam='git commit -am'
alias omzupdate='~/.oh-my-zsh && git reset --hard HEAD && omz update && cd -'

if command -v kubecolor >/dev/null 2>&1; then
  alias kubectl=kubecolor
  alias k=kubecolor
  compdef kubecolor=kubectl
else
  alias kubectl=kubectl
  alias k=kubectl
fi

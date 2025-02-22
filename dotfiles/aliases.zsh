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

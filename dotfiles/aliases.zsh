# Aliases
alias shutdown=poweroff

# Git aliases
alias gitconfig='
    git config --global user.email "javydekoning+github@gmail.com" &&
    git config --global user.name "javydekoning" &&
    git config --global core.autocrlf false
'
alias gs='git status'
alias gcam='git commit -am'
alias omzupdate='cd ~/.oh-my-zsh && git reset --hard HEAD && omz update && cd -'

if command -v kubecolor >/dev/null 2>&1; then
  alias kubectl=kubecolor
  alias k=kubecolor
  compdef kubecolor=kubectl
else
  alias kubectl=kubectl
  alias k=kubectl
fi

# Dev aliases
alias tf='terraform'
alias runlinter='npx mega-linter-runner --fix'

# Cachy linux aliases
alias cleanup='sudo pacman -Rns (pacman -Qtdq)'
alias dir='dir --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias fixpacman='sudo rm /var/lib/pacman/db.lck'
alias grep='grep --color=auto'
alias hw='hwinfo --short'
alias untar='tar -zxvf '
alias update='sudo pacman -Syu'
alias wget='wget -c '

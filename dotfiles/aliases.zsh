# Aliases
alias shutdown=poweroff
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

alias tf='terraform'
alias runlinter='npx mega-linter-runner --fix'

# Cachy aliases
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
alias kgn-nebius='k get nodes -L nebius.com/resource-preset,node.kubernetes.io/instance-type,slurm.nebius.ai/nodeset'
alias ssh-slurm-login='ssh root@$(terraform state show module.login_script.terraform_data.lb_service_ip | grep "input" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" | head -n 1) -i ~/.ssh/id_ed25519'

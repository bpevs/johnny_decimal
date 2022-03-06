# Example zshrc
export ZSH=$HOME/.oh-my-zsh
export UPDATE_ZSH_DAYS=30
ZSH_THEME="theunraveler"
source $ZSH/oh-my-zsh.sh

CASE_SENSITIVE="true"
COMPLETION_WAITING_DOTS="true" # Show dots for tasks that take 5ever
DISABLE_AUTO_UPDATE="false"
LS_COLORS="" # Remove colors on ls
plugins=(git)

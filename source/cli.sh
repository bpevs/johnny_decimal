# Since Deno will run in a subprocess, we use bash for handling chdir.
# Until I make a more standard installation process, either:
#   1. Copypasta this code into your .zshrc or .bashrc
#   2. Source this file from one of those files (source johnny_decimal/cli.sh)

jd() {
  # Handle cd methods
  if [[ "$1" =~ ^[0-9]{2}-[0-9]{2}$ ]]; then
    # Matches area regex: `dd-dd`. Navigate to area
    cd $JD_HOME/${1}*/;
  elif [[ "$1" =~ ^[0-9]{2}$ ]]; then
    # Matches category regex: `dd`. Navigate to category
    cd $JD_HOME/*/${1}*/;
  # User is specifying "cd". Check for id navigation
  elif [[ "$1" =~ ^[0-9]{2}\.[0-9]{2}$ ]]; then
    # Matches id regex: `dd.dd`. Navigate to id
    cd $JD_HOME/*/*/${1}*/;
  elif [ $# == 0 ]; then
    # No arg for cd. Navigate to root.
    cd $JD_HOME;
  fi

  johnny_decimal $*
}

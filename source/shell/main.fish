set _jd_area_regex '^(?<categoryA>[0-9]{2})-(?<categoryB>[0-9]{2})$'
set _jd_category_regex '^(?<category>[0-9]{2})$'
set _jd_id_regex '^(?<category>[0-9]{2})\.(?<id>[0-9]{2,4})$'

function jd -d "Johnny Decimal CLI"
  set -l SEARCH $argv[1]

  if string match -rq -- $_jd_area_regex $SEARCH
    # Matches id regex: `dd-dd`. Navigate to id
    cd (find -E $JD_HOME -regex "$JD_HOME/$argv.*" -depth 1 -type d);
  else if string match -rq -- $_jd_category_regex $SEARCH
    # Matches category regex: `dd`. Navigate to category
    cd (find -E $JD_HOME -regex "$JD_HOME/.*/$argv.*" -depth 2 -type d);
  else if string match -rq -- $_jd_id_regex $SEARCH
    cd (find -E $JD_HOME -regex "$JD_HOME/.*/.*/$argv.*" -depth 3 -type d);
  else if count $argv > /dev/null
    # If there is a non-cd arg, run deno script
    if test -e "$DENO_INSTALL_ROOT/jd"
      $DENO_INSTALL_ROOT/jd $argv;
    else if test -e "$DENO_DIR/bin/jd"
      $HOME/.deno/bin/jd $argv;
    else
      johnny_decimal $argv;
    end
  else
    # No arg for cd. Navigate to root.
    cd $JD_HOME 2>/dev/null;
  end
end


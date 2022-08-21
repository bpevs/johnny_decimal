# Contributed by https://github.com/brandonpittman
# https://github.com/bpevs/johnny_decimal/issues/7

function jd
  set -l SEARCH $argv[1]

  if string match -rq '^(?<category>[0-9]{2})$' $SEARCH
    # Matches category regex: `dd`. Navigate to category
    set -l CATEGORY (find -E $JD_HOME -regex ".*/$SEARCH .*" -depth 2 -type d) 2>/dev/null;

    test -z "$CATEGORY" && cd $JD_HOME && return 1
    cd $CATEGORY
  else if string match -rq '^(?<category>[0-9]{2})\.(?<id>[0-9]{2,4})$' $SEARCH
    # Matches id regex: `dd.dd`. Navigate to id
    set -l CATEGORY (find -E $JD_HOME -regex ".*/$category .*" -depth 2 -type d) 2>/dev/null;
    set -l ID (find -E $CATEGORY -regex ".*/$id ?.*" -type d ) 2>/dev/null;

    test -z "$ID" && cd $JD_HOME && return 1

    cd $ID
  else if count $argv > /dev/null
    # If there is a non-cd arg, run deno script
    $DENO_DIR/bin/jd $argv
  else
    # No arg for cd. Navigate to root.
    cd $JD_HOME 2>/dev/null;
  end
end

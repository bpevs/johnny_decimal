const commands = {
  "jd --help": "Show this message",
  "jd [<location>]":
    "Change directory to location. If location ommitted, go to root.",
  "jd ls [<location>]": "List files in a location",
  "jd open <location>": "Open location, using $JD_DEFAULT_APP",
};

const helpText = `\
Johnny Decimal CLI

Note: <location> refers to a Johnny Decimal location. This includes:
  - Area Locations: \`10-19\`
  - Category Locations: \`11\`
  - ID Locations: \`11.02\`

Usage:\
`;

export function help() {
  console.log(helpText);
  console.table(commands);
}

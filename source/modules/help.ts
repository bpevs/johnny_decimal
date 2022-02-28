const commands = {
  "jd --help": "Show this message",
  "jd <location>": "Open location, or list locations in an Area/Category",
  "jd list [<location>]": "List files in a location",
};

const helpText = `\
Johnny Decimal CLI

Note: <location> refers to a Johnny Decimal location. This includes:
  - Area Locations: \`10-19\`
  - Category Locations: \`11\`
  - ID Locations: \`11.02\`

Usage:\
`;

// const usageText = `\
// ${commands.map(formatCommandString)}
// `;

export function help() {
  console.log(helpText);
  console.table(commands);
}

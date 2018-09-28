require(`colors`);

const HELP_COMMAND = `--help`;
const VERSION_COMMAND = `--version`;

module.exports = {
  isApplicable(command) {
    return command === HELP_COMMAND;
  },
  execute() {
    console.log(`This application does nothing. Accessible params:
${HELP_COMMAND.italic.gray}    — prints this info;
${VERSION_COMMAND.italic.gray} — prints application version;`);
  }
};

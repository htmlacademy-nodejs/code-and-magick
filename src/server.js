'use strict';

const express = require(`express`);
const wizardsGenerator = require(`./generator/wizards-generator`);
const app = express();

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

app.use(express.static(`${__dirname}/../static`));

const wizards = wizardsGenerator.generateEntity();

app.get(`/api/wizards`, (req, res) => {
  res.send(wizards);
});

app.use(NOT_FOUND_HANDLER);

const runServer = (port) => {

  port = parseInt(port, 10);

  app.listen(port, () => console.log(`Сервер запущен: http://localhost:${port}`));
};

const RUN_SERVER_COMMAND = `--server`;

module.exports = {
  isApplicable(command) {
    return command === RUN_SERVER_COMMAND;
  },
  execute(port = 3000) {
    runServer(port);
  },
  app
};

if (require.main === module) {
  runServer(3000);
}

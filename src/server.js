'use strict';

const express = require(`express`);
const wizardsGenerator = require(`./generator/wizards-generator`);
const app = express();

app.use(express.static(`${__dirname}/../static`));

const wizards = wizardsGenerator.generateEntity();

app.get(`/api/wizards`, (req, res) => {
  res.send(wizards);
});

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
  }
};

runServer(3000);

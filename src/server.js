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

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
}

app.get(`/api/wizards/:name`, (req, res) => {
  const wizardName = req.params.name;
  if (!wizardName) {
    throw new IllegalArgumentError(`В запросе не указано имя`);
  }

  const found = wizards.find((it) => it.name === wizardName);
  if (!found) {
    throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
  }

  res.send(found);
});

app.use(NOT_FOUND_HANDLER);

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
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
  },
  app
};

if (require.main === module) {
  runServer(3000);
}

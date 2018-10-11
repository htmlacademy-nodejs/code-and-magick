'use strict';

const express = require(`express`);
const wizardsRouter = require(`./wizards/route`);
const app = express();

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};
const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

app.use(express.static(`${__dirname}/../static`));

app.use(`/api/wizards`, wizardsRouter);

app.use(NOT_FOUND_HANDLER);

app.use(ERROR_HANDLER);

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

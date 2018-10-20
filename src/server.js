'use strict';

const express = require(`express`);
const wizardsStore = require(`./wizards/store`);
const imagesStore = require(`./images/store`);
const wizardsRouter = require(`./wizards/route`)(wizardsStore, imagesStore);
const app = express();

const {
  SERVER_PORT = 3000,
  SERVER_HOST = `localhost`
} = process.env;

app.use(express.static(`${__dirname}/../static`));

app.use(`/api/wizards`, wizardsRouter);

const runServer = ({host, port}) => {
  port = parseInt(port, 10);

  app.listen(port, host, () => {
    console.log(`Сервер запущен: http://${host}:${port}`);
  });
};

const RUN_SERVER_COMMAND = `--server`;

module.exports = {
  isApplicable(command) {
    return command === RUN_SERVER_COMMAND;
  },
  execute() {
    runServer({host: SERVER_HOST, port: SERVER_PORT});
  },
  app
};

if (require.main === module) {
  runServer({host: SERVER_HOST, port: SERVER_PORT});
}

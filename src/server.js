'use strict';

const express = require(`express`);
const wizardsStore = require(`./wizards/store`);
const wizardsRouter = require(`./wizards/route`)(wizardsStore);
const app = express();


app.use(express.static(`${__dirname}/../static`));

app.use(`/api/wizards`, wizardsRouter);

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

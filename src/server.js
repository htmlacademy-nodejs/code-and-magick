'use strict';

const express = require(`express`);
const app = express();

app.get(`/`, (req, res) => res.send(`Hello World!`));

const runServer = (port) => {

  port = parseInt(port, 10);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
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

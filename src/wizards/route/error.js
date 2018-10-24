'use strict';

const MongoError = require(`mongodb`).MongoError;

const ValidationError = require(`../../error/validation-error`);
const logger = require(`../../logger`);

module.exports = (wizardsRouter) => {
  const NOT_FOUND_HANDLER = (req, res) => {
    res.status(404).send(`Page was not found`);
  };

  const ERROR_HANDLER = (err, req, res, _next) => {
    logger.error(err);

    if (err instanceof ValidationError) {
      res.status(err.code).json(err.errors);
      return;
    } else if (err instanceof MongoError) {
      res.status(400).json(err.message);
      return;
    }

    res.status(err.code || 500).send(err.message);
  };

  wizardsRouter.use(ERROR_HANDLER);
  wizardsRouter.use(NOT_FOUND_HANDLER);
};

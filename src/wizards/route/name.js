'use strict';

const IllegalArgumentError = require(`../../error/illegal-argument-error`);
const NotFoundError = require(`../../error/not-found-error`);
const asyncMiddleware = require(`./async-middleware`);
const logger = require(`../../logger`);

module.exports = (wizardsRouter) => {
  wizardsRouter.get(`/:name`, asyncMiddleware(async (req, res) => {
    const wizardName = req.params.name;
    if (!wizardName) {
      throw new IllegalArgumentError(`В запросе не указано имя`);
    }

    const found = await wizardsRouter.wizardsStore.getWizard(wizardName);
    if (!found) {
      throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
    }

    res.send(found);
  }));

  wizardsRouter.get(`/:name/avatar`, asyncMiddleware(async (req, res) => {
    const wizardName = req.params.name;
    if (!wizardName) {
      throw new IllegalArgumentError(`В запросе не указано имя`);
    }

    const found = await wizardsRouter.wizardsStore.getWizard(wizardName);
    if (!found) {
      throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
    }

    const result = await wizardsRouter.imageStore.get(found._id);
    if (!result) {
      throw new NotFoundError(`Аватар для пользователя "${wizardName}" не найден`);
    }

    res.header(`Content-Type`, `image/jpg`);
    res.header(`Content-Length`, result.info.length);

    res.on(`error`, (e) => logger.error(e));
    res.on(`end`, () => res.end());

    const stream = result.stream;

    stream.on(`error`, (e) => logger.error(e));
    stream.on(`end`, () => res.end());

    stream.pipe(res);
  }));
};

'use strict';

const express = require(`express`);

const wizardsRouter = new express.Router();
const IllegalArgumentError = require(`../error/illegal-argument-error`);
const NotFoundError = require(`../error/not-found-error`);
const multer = require(`multer`);
const MongoError = require(`mongodb`).MongoError;

const ValidationError = require(`../error/validation-error`);
const validate = require(`./validate`);
const toStream = require(`buffer-to-stream`);
const logger = require(`../logger`);

const upload = multer({storage: multer.memoryStorage()});
const jsonParser = express.json();

const PAGE_DEFAULT_LIMIT = 10;

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const toPage = async (cursor, skip = 0, limit = PAGE_DEFAULT_LIMIT) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();
  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count()
  };
};

wizardsRouter.get(``, asyncMiddleware(async (req, res) => {
  const skip = parseInt(req.query.skip || 0, 10);
  const limit = parseInt(req.query.limit || PAGE_DEFAULT_LIMIT, 10);
  if (isNaN(skip) || isNaN(limit)) {
    throw new IllegalArgumentError(`Неверное значение параметра "skip" или "limit"`);
  }
  res.send(await toPage(await wizardsRouter.wizardsStore.getAllWizards(), skip, limit));
}));


wizardsRouter.get(`/:name`, asyncMiddleware(async (req, res) => {
  const wizardName = req.params.name;
  if (!wizardName) {
    throw new IllegalArgumentError(`В запросе не указано имя`);
  }

  const name = wizardName;
  const found = await wizardsRouter.wizardsStore.getWizard(name);
  if (!found) {
    throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
  }

  res.send(found);
}));

wizardsRouter.post(``, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res) => {
  const body = req.body;
  const avatar = req.file;
  if (avatar) {
    body.avatar = {name: avatar.originalname};
  }

  const validated = validate(body);

  const result = await wizardsRouter.wizardsStore.save(validated);
  const insertedId = result.insertedId;

  if (avatar) {
    await wizardsRouter.imageStore.save(insertedId, toStream(avatar.buffer));
  }

  res.send(validated);
}));

wizardsRouter.get(`/:name/avatar`, asyncMiddleware(async (req, res) => {
  const wizardName = req.params.name;
  if (!wizardName) {
    throw new IllegalArgumentError(`В запросе не указано имя`);
  }

  const name = wizardName;
  const found = await wizardsRouter.wizardsStore.getWizard(name);

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


module.exports = (wizardsStore, imagesStore) => {
  wizardsRouter.wizardsStore = wizardsStore;
  wizardsRouter.imageStore = imagesStore;
  return wizardsRouter;
};

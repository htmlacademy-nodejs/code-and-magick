'use strict';

const express = require(`express`);

// eslint-disable-next-line new-cap
const wizardsRouter = express.Router();
const wizardsGenerator = require(`../generator/wizards-generator`);
const IllegalArgumentError = require(`../error/illegal-argument-error`);
const NotFoundError = require(`../error/not-found-error`);
const multer = require(`multer`);

const ValidationError = require(`../error/validation-error`);
const validate = require(`./validate`);

const wizardStore = require(`./store`);

const upload = multer({storage: multer.memoryStorage()});
const jsonParser = express.json();

const PAGE_DEFAULT_LIMIT = 10;

const wizards = wizardsGenerator.generateEntity();

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
  res.send(await toPage(await wizardStore.getAllWizards(), skip, limit));
}));


wizardsRouter.get(`/:name`, (req, res) => {
  const wizardName = req.params.name;
  if (!wizardName) {
    throw new IllegalArgumentError(`В запросе не указано имя`);
  }

  const name = wizardName.toLowerCase();
  const found = wizards.find((it) => it.name.toLowerCase() === name);
  if (!found) {
    throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
  }

  res.send(found);
});

wizardsRouter.post(``, jsonParser, upload.single(`avatar`), (req, res) => {
  const body = req.body;
  const avatar = req.file;
  if (avatar) {
    body.avatar = {name: avatar.originalname};
  }

  res.send(validate(body));
});

wizardsRouter.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
  } else {
    next(err, req, res);
  }
});

module.exports = wizardsRouter;

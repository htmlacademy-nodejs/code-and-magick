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

const upload = multer({storage: multer.memoryStorage()});


const jsonParser = express.json();

const wizards = wizardsGenerator.generateEntity();

wizardsRouter.get(``, (req, res) => {
  res.send(wizards);
});


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

wizardsRouter.use((err, req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
  }
});

module.exports = wizardsRouter;

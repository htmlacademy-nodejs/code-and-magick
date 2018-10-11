'use strict';

// eslint-disable-next-line new-cap
const express = require(`express`);
const wizardsRouter = express.Router();
const wizardsGenerator = require(`../generator/wizards-generator`);
const IllegalArgumentError = require(`../error/illegal-argument-error`);
const NotFoundError = require(`../error/not-found-error`);
const multer = require(`multer`);

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

wizardsRouter.post(``, jsonParser, upload.none(), (req, res) => {
  const body = req.body;
  res.send(body);
});

module.exports = wizardsRouter;

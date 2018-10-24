'use strict';

const express = require(`express`);
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);

const IllegalArgumentError = require(`../../error/illegal-argument-error`);
const asyncMiddleware = require(`./async-middleware`);
const validate = require(`../validate`);

const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});

const PAGE_DEFAULT_LIMIT = 10;

const toPage = async (cursor, skip = 0, limit = PAGE_DEFAULT_LIMIT) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();
  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count()
  };
};


module.exports = (wizardsRouter) => {
  wizardsRouter.get(``, asyncMiddleware(async (req, res) => {
    const skip = parseInt(req.query.skip || 0, 10);
    const limit = parseInt(req.query.limit || PAGE_DEFAULT_LIMIT, 10);

    if (isNaN(skip) || isNaN(limit)) {
      throw new IllegalArgumentError(`Неверное значение параметра "skip" или "limit"`);
    }

    res.send(await toPage(await wizardsRouter.wizardsStore.getAllWizards(), skip, limit));
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
};

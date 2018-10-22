'use strict';

const express = require(`express`);

const corsRoute = require(`./cors`);
const defaultRoute = require(`./default`);
const errorRoute = require(`./error`);
const nameRoute = require(`./name`);

const wizardsRouter = new express.Router();

corsRoute(wizardsRouter);
defaultRoute(wizardsRouter);
nameRoute(wizardsRouter);
errorRoute(wizardsRouter);


module.exports = (wizardsStore, imagesStore) => {
  wizardsRouter.wizardsStore = wizardsStore;
  wizardsRouter.imageStore = imagesStore;
  return wizardsRouter;
};

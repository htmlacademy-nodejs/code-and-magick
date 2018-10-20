'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const wizardsStoreMock = require(`./mock/wizards-store-mock`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const wizardsRoute = require(`../src/wizards/route`)(wizardsStoreMock, imagesStoreMock);

const app = express();

app.use(`/api/wizards`, wizardsRoute);

describe(`POST /api/wizards`, () => {
  it(`send wizard as json`, async () => {

    const sent = {
      username: `SuperWizard`
    };

    const response = await request(app).
      post(`/api/wizards`).
      send(sent).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);


    const wizard = response.body;
    assert.deepEqual(wizard, sent);
  });
  it(`send wizard without name`, async () => {

    const response = await request(app).
      post(`/api/wizards`).
      send({}).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `application/json`).
      expect(400).
      expect(`Content-Type`, /json/);


    const errors = response.body;
    assert.deepEqual(errors, [
      `Field name "name" is required!`
    ]);
  });

  it(`send wizard as multipart/form-data`, async () => {

    const wizardName = `SuperWizard`;

    const response = await request(app).
      post(`/api/wizards`).
      field(`username`, wizardName).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);


    const wizard = response.body;
    assert.deepEqual(wizard, {username: wizardName});
  });
  it(`send wizard with avatar as multipart/form-data`, async () => {

    const wizardName = `SuperWizard`;

    const response = await request(app).
      post(`/api/wizards`).
      field(`username`, wizardName).
      attach(`avatar`, `test/fixtures/keks.png`).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);


    const wizard = response.body;
    assert.deepEqual(wizard, {username: wizardName, avatar: {name: `keks.png`}});
  });

});


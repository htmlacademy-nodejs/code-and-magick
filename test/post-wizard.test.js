'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/server`).app;

describe(`POST /api/wizards`, () => {
  it(`send wizard as json`, async () => {

    const sent = {
      name: `SuperWizard`
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

  it(`send wizard as multipart/form-data`, async () => {

    const wizardName = `SuperWizard`;

    const response = await request(app).
      post(`/api/wizards`).
      field(`name`, wizardName).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);


    const wizard = response.body;
    assert.deepEqual(wizard, {name: wizardName});
  });
  it(`send wizard with avatar as multipart/form-data`, async () => {

    const wizardName = `SuperWizard`;

    const response = await request(app).
      post(`/api/wizards`).
      field(`name`, wizardName).
      attach(`avatar`, `test/fixtures/keks.png`).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);


    const wizard = response.body;
    assert.deepEqual(wizard, {name: wizardName});
  });

});


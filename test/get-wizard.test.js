'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const wizardsStoreMock = require(`./mock/wizards-store-mock`);
const wizardsRoute = require(`../src/wizards/route`)(wizardsStoreMock);

const app = express();

app.use(`/api/wizards`, wizardsRoute);

describe(`GET /api/wizards`, () => {
  it(`get all wizards`, async () => {

    const response = await request(app).
      get(`/api/wizards`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizards = response.body;
    assert.equal(wizards.total, 17);
    assert.equal(wizards.data.length, 10);
  });

  it(`get all wizards?skip=2&limit=20`, async () => {

    const response = await request(app).
      get(`/api/wizards?skip=2&limit=20`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizards = response.body;
    assert.equal(wizards.total, 17);
    assert.equal(wizards.data.length, 15);
  });

  it(`get all wizards with / at the end`, async () => {

    const response = await request(app).
      get(`/api/wizards/`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizards = response.body;
    assert.equal(wizards.total, 17);
    assert.equal(wizards.data.length, 10);
  });

});

describe(`GET /api/wizards/:name`, () => {
  it(`get wizard with name "Мерлин"`, async () => {
    const response = await request(app).
      get(`/api/wizards/${encodeURI(`Мерлин`)}`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizard = response.body;
    assert.strictEqual(wizard.name, `Мерлин`);
  });

  it(`get wizard with name "Мерлин" in lower case`, async () => {
    const response = await request(app).
      get(`/api/wizards/${encodeURI(`мерлин`)}`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizard = response.body;
    assert.strictEqual(wizard.name, `Мерлин`);
  });

  it(`get unknown wizard with name "Шаполкляк"`, async () => {
    return request(app).
      get(`/api/wizards/${encodeURI(`шапокляк`)}`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Маг с именем "шапокляк" не найден`).
      expect(`Content-Type`, /html/);
  });
});

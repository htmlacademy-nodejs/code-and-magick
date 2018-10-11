const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/server`).app;

describe(`GET /api/wizards`, () => {
  it(`get all wizards`, async () => {

    const response = await request(app).
      get(`/api/wizards`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);

    const wizards = response.body;
    assert.equal(wizards.length, 17);
  });

  it(`get data from unknown resource`, async () => {
    return request(app).
      get(`/api/oneone`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Content-Type`, /html/);
  });

});

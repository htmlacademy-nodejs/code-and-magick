const request = require(`supertest`);
const assert = require(`assert`);

const app = require(`../src/server`).app;

describe(`GET /api/wizards`, () => {
  it(`respond with json`, () => {
    return request(app).
      get(`/api/wizards`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((response) => {
        const wizards = response.body;
        assert.equal(wizards.length, 17);
      });
  });
});

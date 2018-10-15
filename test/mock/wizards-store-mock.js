'use strict';

const Cursor = require(`./cursor-mock`);
const wizardsGenerator = require(`../generator/wizards-generator`);

class WizardStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getWizard(username) {
    return this.data.filter((it) => it.name.toLowerCase() === username)[0];
  }

  async getAllWizards() {
    return new Cursor(this.data);
  }

  async save() {
  }

}

module.exports = new WizardStoreMock(wizardsGenerator.generateEntity());

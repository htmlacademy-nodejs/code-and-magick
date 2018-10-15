'use strict';

const db = require(`../database/db`);

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`wizards`);
  collection.createIndex({username: -1}, {unique: true});
  return collection;
};

class WizardStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getWizard(username) {
    return (await this.collection).findOne({username});
  }

  async getAllWizards() {
    return (await this.collection).find();
  }

  async save(wizardData) {
    return (await this.collection).insertOne(wizardData);
  }

}

module.exports = new WizardStore(setupCollection().
  catch((e) => console.error(`Failed to set up "wizards"-collection`, e)));

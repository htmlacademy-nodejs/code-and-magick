'use strict';

const {MongoClient} = require(`mongodb`);

const {
  DB_HOST = `localhost:27017`,
  DB_PATH = `code-and-magick`
} = process.env;

const url = `mongodb://${DB_HOST}`;

module.exports = MongoClient.connect(url).then((client) => client.db(DB_PATH)).catch((e) => {
  console.error(`Failed to connect to MongoDB`, e);
  process.exit(1);
});

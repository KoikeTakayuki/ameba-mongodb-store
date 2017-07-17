const MongoClient = require('mongodb').MongoClient;
const store = require('./store');

const getStore = url =>
  new Promise((success, failure) =>
    MongoClient.connect(url, (err, db) => {
      if (err) {
        failure(err);
      }

      success(store(db));
    }));

module.exports = getStore;

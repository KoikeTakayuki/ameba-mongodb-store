const MongoClient = require('mongodb').MongoClient;

function createConnection(url, user, password) {
  return new Promise((success, failure) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        failure(err);
      } else {
        success(db);
      }
    });
  });
}

module.exports = createConnection;

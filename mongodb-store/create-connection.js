const MongoClient = require('mongodb').MongoClient;

function createConnection(ip, port, dbName, user, password) {
  return new Promise((success, failure) => {
    const url = `mongodb://${user}:${password}@${ip}:${port}/${dbName}`;
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

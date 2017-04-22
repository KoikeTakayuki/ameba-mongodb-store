const getRootType = require('ameba-util').getRootType;



module.exports = (connection) => {
  function readRecord(recordType, condition) {
    const collectionName = getRootType(recordType).id;
    return connection.then(db => db.collection(collectionName))
      .then(collection => new Promise((success, failure) =>
        collection.find(condition).toArray((e, docs) => {
          if (e) {
            failure(e);
          } else {
            success(docs);
          }
        })));
  }

  return readRecord;
};

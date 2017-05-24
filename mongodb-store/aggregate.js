const util = require('ameba-util');

const getRootType = util.getRootType;

module.exports = (connection) => {
  function aggregate(recordType, params) {
    return connection
      .then(db => new Promise((success, failure) => {
        const collectionName = getRootType(recordType).id;
        const collection = db.collection(collectionName);

        collection.aggregate(params).toArray((e, docs) => {
          if (e) {
            failure(e);
          } else {
            success(docs);
          }
        });
      }));
  }

  return aggregate;
};

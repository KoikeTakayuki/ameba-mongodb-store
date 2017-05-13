const ObjectID = require('mongodb').ObjectID;
const getRootType = require('ameba-util').getRootType;

module.exports = (connection) => {
  function deleteRecord(recordType, record) {
    if (!record._id) {
      throw Error('given record is not stored');
    }

    const collectionName = getRootType(recordType).id;

    return connection
      .then(db => new Promise((success, failure) => {
        const collection = db.collection(collectionName);
        const deleteCondition = { _id: new ObjectID(record._id) };

        collection.remove(deleteCondition, { single: true }, (e) => {
          if (e) {
            failure(e);
          } else {
            success();
          }
        });
      }));
  }

  return deleteRecord;
};

const ObjectID = require('mongodb').ObjectID;
const getRootType = require('ameba-util').getRootType;

module.exports = (connection) => {
  function deleteRecord(record) {
    if (!record._id) {
      throw Error('given record is not stored and cannot be deleted');
    }

    const collectionName = getRootType(record.type).id;

    return connection
      .then(db => db.collection(collectionName))
      .then(collection => new Promise((success, failure) => {
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

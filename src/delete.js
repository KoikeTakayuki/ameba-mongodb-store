const getRootType = require('ameba-core').util.getRootType;
const filterByFields = require('./filterByFields');
const ObjectID = require('mongodb').ObjectID;

const deleteRecord = db => (recordType, condition) => {
  const rootType = getRootType(recordType);
  const collection = db.collection(rootType.id);
  const deleteCondition = condition._id ?
    { _id: ObjectID(condition._id) } : filterByFields(condition, recordType);

  return new Promise((success, failure) =>
    collection.deleteOne(deleteCondition, (e, result) => {
      if (e) {
        failure(e);
      }

      success(result.deletedCount);
    }));
};

module.exports = deleteRecord;

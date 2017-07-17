const ObjectID = require('mongodb').ObjectID;
const getRootType = require('ameba-core').util.getRootType;
const filterByFields = require('./filterByFields');
const getInsertOrUpdateValue = require('./getInsertOrUpdateValue');


const update = db => (recordType, condition, values, option) => {
  const rootType = getRootType(recordType);
  const collection = db.collection(rootType.id);
  const updateCondition = condition._id ?
    { _id: ObjectID(condition._id) } : filterByFields(condition, recordType);

  return getInsertOrUpdateValue(db, recordType, values).then(updateValue =>
    new Promise((success, failure) =>
      collection.updateOne(updateCondition, { $set: updateValue }, option, (e, result) => {
        if (e) {
          failure(e);
        }

        success(result.modifiedCount);
      })));
};

module.exports = update;

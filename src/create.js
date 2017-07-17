const util = require('ameba-core').util;
const getInsertOrUpdateValue = require('./getInsertOrUpdateValue');

const getRootType = util.getRootType;

const create = db => (recordType, record) => {
  const rootType = getRootType(recordType);
  const collection = db.collection(rootType.id);

  return getInsertOrUpdateValue(db, recordType, record).then(insertValue =>
    new Promise((success, failure) =>
      collection.insertOne(insertValue, { serializeFunctions: true }, (err, result) => {
        if (err) {
          failure(err);
        }

        success({ _id: result.insertedId });
      })));
};

module.exports = create;

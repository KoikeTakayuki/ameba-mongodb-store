const util = require('ameba-util');
const attachTypePredicates = require('./attach-type-predicates');

const getRootType = util.getRootType;
const getHierarchyFields = util.getHierarchyFields;

function getReadFieldIds(recordType) {
  const fields = getHierarchyFields(recordType);
  const readFieldIds = { _id: 1 };

  fields.forEach((f) => {
    readFieldIds[f.id] = 1;
  });

  return readFieldIds;
}

module.exports = (connection) => {
  function readRecord(recordType, condition, optionalArguments) {
    const collectionName = getRootType(recordType).id;

    return connection
      .then(db => db.collection(collectionName))
      .then(collection => new Promise((success, failure) => {
        const readFieldIds = getReadFieldIds(recordType);

        let result = collection.find(attachTypePredicates(condition, recordType), readFieldIds);
        const promiseCallback = (e, docs) => {
          if (e) {
            failure(e);
          } else {
            success(docs);
          }
        };

        if (optionalArguments && optionalArguments.count) {
          return result.count(promiseCallback);
        }

        if (optionalArguments && optionalArguments.limit) {
          result = result.limit(optionalArguments.limit);
        }

        if (optionalArguments && optionalArguments.skip) {
          result = result.skip(optionalArguments.skip);
        }

        return result.toArray(promiseCallback);
      }));
  }

  return readRecord;
};

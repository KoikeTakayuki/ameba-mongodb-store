const util = require('ameba-util');
const attachTypePredicates = require('./attach-type-predicates');

const getRootType = util.getRootType;
const getHierarchyFields = util.getHierarchyFields;
const filterByFields = require('./filter-by-fields');

// for mongodb read field
function getReadFieldIds(recordType) {
  const fields = getHierarchyFields(recordType);
  const readFieldIds = { _id: 1 };

  fields.forEach((f) => {
    readFieldIds[f.id] = 1;
  });

  return readFieldIds;
}

module.exports = (connection) => {
  function read(recordType, condition, optionalArguments) {
    return connection
      .then(db => new Promise((success, failure) => {
        const collectionName = getRootType(recordType).id;
        const collection = db.collection(collectionName);
        const readFieldIds = getReadFieldIds(recordType);
        const readCondition = filterByFields(condition, recordType);

        let result = collection.find(attachTypePredicates(readCondition, recordType), readFieldIds);

        if (optionalArguments && optionalArguments.limit) {
          result = result.limit(parseInt(optionalArguments.limit, 10));
        }

        if (optionalArguments && optionalArguments.skip) {
          result = result.skip(parseInt(optionalArguments.skip, 10));
        }

        if (optionalArguments && optionalArguments.sort) {
          const sortParams = {};
          Object.keys(optionalArguments.sort).forEach((key) => {
            sortParams[key] = parseInt(optionalArguments.sort[key], 10);
          });
          result = result.sort(sortParams);
        }

        return result.toArray((e, docs) => {
          if (e) {
            failure(e);
          } else {
            success(docs);
          }
        });
      }));
  }

  return read;
};

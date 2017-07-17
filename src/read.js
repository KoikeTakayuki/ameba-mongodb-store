const util = require('ameba-core').util;
const addTypePredicates = require('./addTypePredicates');
const filterByFields = require('./filterByFields');
const _ = require('lodash');

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

const read = db => (recordType, condition, args) => {
  const rootType = getRootType(recordType);
  const collection = db.collection(rootType.id);
  const readFieldIds = getReadFieldIds(recordType);
  const readCondition = filterByFields(condition, recordType);
  const result = collection.find(addTypePredicates(readCondition, recordType), readFieldIds);

  if (_.isObject(args)) {
    if (Number.isInteger(args.limit)) {
      result.limit(args.limit);
    }

    if (Number.isInteger(args.skip)) {
      result.skip(args.skip);
    }
  }

  return new Promise((success, failure) =>
    result.toArray((e, docs) => {
      if (e) {
        failure(e);
      }

      success(docs);
    }));
};

module.exports = read;

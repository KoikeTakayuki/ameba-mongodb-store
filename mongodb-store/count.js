const util = require('ameba-util');
const attachTypePredicates = require('./attach-type-predicates');

const getRootType = util.getRootType;

module.exports = (connection) => {
  function count(recordType, condition) {
    return connection
      .then(db => new Promise((success, failure) => {
        const collectionName = getRootType(recordType).id;
        const collection = db.collection(collectionName);
        const countCondition = condition || {};

        try {
          const result = collection.find(attachTypePredicates(countCondition, recordType)).count();
          return success(result);
        } catch (e) {
          return failure(e);
        }
      }));
  }

  return count;
};

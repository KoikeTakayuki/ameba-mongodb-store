const getRootType = require('ameba-util').getRootType;
const filterByFields = require('./filter-by-fields');

function update(connection) {
  return (recordType, condition, values, option) =>
    connection.then((db) => {
      const collectionName = getRootType(recordType).id;
      const collection = db.collection(collectionName);
      const updateCondition = filterByFields(condition, recordType);
      const updateValues = filterByFields(values, recordType);

      return new Promise((success, failure) => {
        collection.update(updateCondition, { $set: updateValues }, option, (e) => {
          if (e) {
            failure(e);
          } else {
            success();
          }
        });
      });
    });
}

module.exports = update;

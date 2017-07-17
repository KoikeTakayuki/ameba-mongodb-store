const save = require('./save');
const util = require('ameba-core').util;
const _ = require('lodash');

const getHierarchyFields = util.getHierarchyFields;

const getInsertOrUpdateValue = (db, recordType, record) => {
  const fields = getHierarchyFields(recordType);
  const result = {};
  const saveFieldIds = [];
  const promises = [];

  fields.forEach((f) => {
    const fieldType = f.fieldType;
    const fieldValue = record[f.id];

    if (fieldValue === undefined) {
      return;
    }

    if (fieldType.isInnerType) {
      result[f.id] = fieldValue;
    } else {
      saveFieldIds.push(f.id);
      promises.push(save(db)(fieldType, fieldValue));
    }
  });

  return Promise.all(promises).then((saveResults) => {
    _.each(saveResults, (saveResult, index) => {
      const fieldId = saveFieldIds[index];
      result[fieldId] = saveResult._id;
    });

    return result;
  });
};

module.exports = getInsertOrUpdateValue;

const getHierarchyFields = require('ameba-util').getHierarchyFields;
const ObjectID = require('mongodb').ObjectID;

function filterByFields(values, recordType) {
  if (!values) {
    return {};
  }

  const fieldIds = getHierarchyFields(recordType).map(f => f.id);
  const result = {};

  Object.keys(values).forEach((key) => {
    if (fieldIds.indexOf(key) > -1) {
      result[key] = values[key];
    }
  });

  if (values._id) {
    result._id = new ObjectID(values._id);
  }

  return result;
}

module.exports = filterByFields;

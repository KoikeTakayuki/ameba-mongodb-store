const getHierarchyFields = require('ameba-util').getHierarchyFields;

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

  return result;
}

module.exports = filterByFields;

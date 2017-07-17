const getHierarchyFields = require('ameba-core').util.getHierarchyFields;
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const filterByFields = (values, recordType) => {
  if (!values) {
    return {};
  }

  const result = {};
  const fieldIds = getHierarchyFields(recordType).map(f => f.id);
  _.each(values, (value, key) => {
    if (_.includes(fieldIds, key)) {
      result[key] = value;
    }
  });

  if (values._id) {
    result._id = new ObjectID(values._id);
  }

  return result;
};

module.exports = filterByFields;

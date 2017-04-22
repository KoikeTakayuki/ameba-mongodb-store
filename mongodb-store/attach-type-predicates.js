const getRootType = require('ameba-util').getRootType;

function getTypePredicateName(recordType) {
  const typeId = recordType.id.substring(recordType.id.lastIndexOf('.') + 1);
  const predicateName = `is${typeId}`;

  return predicateName;
}

function attachTypePredicates(record, recordType) {
  const rootType = getRootType(recordType);

  if (recordType.id === rootType.id) {
    return record;
  }

  const result = {};

  let baseType = recordType.baseType;
  let predicateName = getTypePredicateName(recordType);

  Object.assign(result, record);
  result[predicateName] = true;

  while (baseType.id !== rootType.id) {
    predicateName = getTypePredicateName(recordType);
    result[predicateName] = true;
    baseType = baseType.baseType;
  }

  return result;
}

module.exports = attachTypePredicates;

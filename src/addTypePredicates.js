const getRootType = require('ameba-core').util.getRootType;

function getTypePredicateName(recordType) {
  const typeId = recordType.id.substring(recordType.id.lastIndexOf('.') + 1);
  return `is${typeId}`;
}

function attachTypePredicates(target, recordType) {
  const rootType = getRootType(recordType);

  if (recordType.id === rootType.id) {
    return target;
  }

  const result = {};

  let baseType = recordType.baseType;
  let predicateName = getTypePredicateName(recordType);

  Object.assign(result, target);
  result[predicateName] = true;

  while (baseType.id !== rootType.id) {
    predicateName = getTypePredicateName(recordType);
    result[predicateName] = true;
    baseType = baseType.baseType;
  }

  return result;
}

module.exports = attachTypePredicates;

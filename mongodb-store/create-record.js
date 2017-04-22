const util = require('ameba-util');
const typeField = require('ameba-core').Fields.type;
const save = require('./save-record');

const getHierarchyFields = util.getHierarchyFields;
const getRootType = util.getRootType;

function getTypePredicateName(type) {
  const typeId = type.id.substring(type.id.lastIndexOf('.') + 1);
  const predicateName = `is${typeId}`;

  return predicateName;
}

function attachTypePredicates(insertRecord, type) {
  const rootType = getRootType(type);

  if (type.id === rootType.id) {
    return insertRecord;
  }

  const result = {};

  let baseType = type.baseType;
  let predicateName = getTypePredicateName(type);

  Object.assign(result, insertRecord);
  result[predicateName] = true;

  while (baseType.id !== rootType.id) {
    predicateName = getTypePredicateName(type);
    result[predicateName] = true;
    baseType = baseType.baseType;
  }

  return result;
}

module.exports = (connection) => {
  function getInsertRecord(record) {
    function getInsertFieldValue(fieldValue, fieldType) {
      if (fieldValue === null || fieldValue === undefined || fieldType.isPrimitiveType) {
        return Promise.resolve(fieldValue);
      } else if (fieldType.isInnerType) {
        return getInsertRecord(fieldValue);
      }

      return save(connection)(fieldValue).then(r => r._id);
    }

    const fields = getHierarchyFields(record.type);

    return fields.reduce((acc, f) => {
      if (f.id === typeField.id) {
        return acc;
      }

      return acc.then((data) => {
        const fieldValue = record[f.id];
        const fieldType = f.id === 'defaultValue' ? record.fieldType : f.fieldType;
        let promise;

        if (f.isListField) {
          promise = fieldValue.reduce((resultPromise, value) =>
            resultPromise.then(result =>
              getInsertFieldValue(value, fieldType).then(
                insertFieldValue => result.concat([insertFieldValue]))), Promise.resolve([]));
        } else {
          promise = getInsertFieldValue(fieldValue, fieldType);
        }

        return promise.then((insertFieldValue) => {
          const result = {};
          Object.assign(result, data);
          result[f.id] = insertFieldValue;
          return result;
        });
      });
    }, Promise.resolve({})).then(insertRecord => attachTypePredicates(insertRecord, record.type));
  }

  function createRecord(record) {
    const rootType = getRootType(record.type);
    const rootTypeId = rootType.id;

    return connection
      .then(db => db.collection(rootTypeId))
      .then(collection => getInsertRecord(record)
        .then(insertRecord => new Promise((success, failure) => {
          collection.insert(insertRecord, (e, results) => {
            if (e) {
              failure(e);
            } else {
              const referenceId = results.insertedIds[0];
              const result = {};
              result._id = referenceId;
              Object.assign(result, insertRecord);
              success(result);
            }
          });
        })));
  }

  return createRecord;
};

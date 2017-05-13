const util = require('ameba-util');
const typeField = require('ameba-core').Fields.type;
const attachTypePredicates = require('./attach-type-predicates');

const getHierarchyFields = util.getHierarchyFields;
const getRootType = util.getRootType;

function create(connection) {
  function getInsertRecord(record) {
    function getInsertFieldValue(fieldValue, fieldType) {
      if (fieldValue === null || fieldValue === undefined || fieldType.isPrimitiveType) {
        return Promise.resolve(fieldValue);
      }

      if (fieldType.isInnerType) {
        return getInsertRecord(fieldValue);
      }

      if (fieldValue._id) {
        return Promise.resolve(fieldValue._id);
      }

      return create(connection)(fieldValue).then(r => r._id);
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
}

module.exports = create;

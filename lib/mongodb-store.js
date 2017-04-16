const store = {};
const Core = require('ameba-core');
const Server = require('mongodb').Server;
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://127.0.0.1:27017/ameba";

module.exports = function () {
  return store;
};

store.save = function (record) {
  if (record._id) {
    return Promise.resolve({_id: record._id});
  } else {
    return create(record);
  }
};


function create(record) {
  return new Promise(function(success, failure) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        failure(err);
      } else {
        let collection = db.collection(getCollectionName(record));

        getInsertRecordData(record).then(function (result) {
          collection.insert(result, function (err, results) {
            if (err) {
              failure(err);
            } else {
              let systemId = results.insertedIds[0];
              record._id = systemId;
              result._id = systemId;
              success(result);
            }

            db.close();
          });
        }).catch(function (e) {
          db.close();
          failure(e)
        });
      }
    });
  })
}

/**
 * 
 * @param {*} record 
 * @return Promise<Object>
 */
function getInsertRecordData(record) {
  //Helper Function
  function getInsertFieldValue(fieldValue, fieldType) {
      //Primitiveフィールドの場合
      if (fieldType.isPrimitiveType) {
        return Promise.resolve(fieldValue);

      //中に埋め込むレコードの場合
      } else if (fieldType.isInnerType) {
        return getInsertRecordData(fieldValue);

      //外部レコードの場合
    } else {
        console.log("test")
        return store.save(fieldValue).then(function (r) {
          return r._id;
        });
      }
  }

  let fields = record.type.fields;

  return fields.reduce(function (acc, f) {
    if (f.id === 'type') {
      return acc;
    }
    return acc.then(function (data) {
      let fieldValue = record[f.id];
      let fieldType = f.fieldType;
      var promise;

      //Listフィールドの場合
      if (f.isListField) {
        promise = fieldValue.reduce(function (p, element) {
          return p.then(function (arr) {
            return getInsertFieldValue(element, fieldType).then(function (insertFieldValue) {
              return arr.concat([insertFieldValue]);
            });
          });
        }, Promise.resolve([]));

      // それ以外
      } else {
        promise = getInsertFieldValue(fieldValue, fieldType);
      }

      return promise.then(function (insertFieldValue) {
        
        data[f.id] = insertFieldValue;
        console.log(data)
        return data;
      })
    });
  }, Promise.resolve({}));

}

function getCollectionName(record) {
  const type = record.type;
  var module = type.module;
  var parentModule = module.parentModule;
  var result = module.id + Core.MODULE_PATH_SEPARTOR + getRootTypeId(type);

  while (parentModule.id !== 'Root') {
    result = parentModule.id + Core.MODULE_PATH_SEPARTOR + result;
    module = parentModule;
    parentModule = parentModule.parentModule;
  }

  return result;
}

function getRootTypeId(type) {
  var baseType = type.baseType;

  if (baseType.id === 'Record') {
    return type.id;
  }

  return getRootTypeId(baseType);
}
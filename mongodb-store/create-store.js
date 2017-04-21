let readRecord;
let saveRecord;
let deleteRecord;

function createStore(connection) {
  return {
    read: readRecord(connection),
    save: saveRecord(connection),
    delete: deleteRecord(connection),
    close: () => connection.then(db => db.close()),
  };
}

module.exports = createStore;

readRecord = require('./read-record');
saveRecord = require('./save-record');
deleteRecord = require('./delete-record');

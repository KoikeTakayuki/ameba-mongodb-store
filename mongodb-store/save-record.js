let createRecord;
let updateRecord;

function saveRecord(connection) {
  return (record) => {
    if (record._id) {
      return updateRecord(connection)(record);
    }
    return createRecord(connection)(record);
  };
}

module.exports = saveRecord;

createRecord = require('./create-record');
updateRecord = require('./update-record');

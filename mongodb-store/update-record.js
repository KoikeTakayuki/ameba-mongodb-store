function updateRecord(connection) {
  return record => {
    return Promise.resolve(record);
  }
}

module.exports = updateRecord;

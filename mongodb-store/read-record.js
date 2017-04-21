module.exports = (db) => {
  function readRecord(query) {
    return [query];
  }

  return readRecord;
};

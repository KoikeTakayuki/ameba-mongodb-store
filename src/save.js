const store = require('./store');

const save = db => (recordType, record) => {
  if (Array.isArray(record)) {
    return Promise.all(record.map(r => save(db)(recordType, r)));
  }

  if (record._id) {
    return store(db).update(recordType, record).then(() => ({ _id: record._id }));
  }

  return store(db).create(recordType, record);
};

module.exports = save;

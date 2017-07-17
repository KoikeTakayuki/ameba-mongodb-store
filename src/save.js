const store = require('./store');

const save = db => (recordType, record) => {
  if (record._id) {
    return store(db).update(recordType, record).then(() => ({ _id: record._id }));
  }

  return store(db).create(recordType, record);
};

module.exports = save;

let create;
let read;
let update;
let deleteRecord;

const store = db => ({
  create: create(db),
  read: read(db),
  update: update(db),
  delete: deleteRecord(db),
  close: () => db.close(),
});

module.exports = store;

create = require('./create');
read = require('./read');
update = require('./update');
deleteRecord = require('./delete');

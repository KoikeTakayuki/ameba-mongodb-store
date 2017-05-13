let create;
let read;
let update;
let deleteRecord;

function createStore(connection) {
  return {
    create: create(connection),
    read: read(connection),
    update: update(connection),
    delete: deleteRecord(connection),
    close: () => connection.then(db => db.close()),
  };
}

module.exports = createStore;

create = require('./create');
read = require('./read');
update = require('./update');
deleteRecord = require('./delete');

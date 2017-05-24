let save;
let read;
let update;
let deleteRecord;
let count;
let aggregate;

function createStore(connection) {
  return {
    save: save(connection),
    read: read(connection),
    update: update(connection),
    delete: deleteRecord(connection),
    count: count(connection),
    aggregate: aggregate(connection),
    close: () => connection.then(db => db.close()),
  };
}

module.exports = createStore;

save = require('./save');
read = require('./read');
update = require('./update');
deleteRecord = require('./delete');
count = require('./count');
aggregate = require('./aggregate');

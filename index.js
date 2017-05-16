const createStore = require('./mongodb-store/create-store');
const createConnection = require('./mongodb-store/create-connection');

const store = (ip, port, dbName, user, password) =>
  createStore(createConnection(ip, port, dbName, user, password));

module.exports = store;

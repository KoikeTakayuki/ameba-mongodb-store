const createStore = require('./mongodb-store/create-store');
const createConnection = require('./mongodb-store/create-connection');

const store = (url, user, password) => {
  createStore(createConnection(url, user, password));
};

module.exports = store;

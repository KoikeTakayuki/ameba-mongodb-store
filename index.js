const createStore = require('./mongodb-store/create-store');
const createConnection = require('./mongodb-store/create-connection');

const store = (ip, port, dbName, user, password) =>
  createStore(createConnection(ip, port, dbName, user, password));

module.exports = store;

const Core = require('ameba-core');

const st = store('127.0.0.1', 27017, 'ameba', 'amebaadmin', 'ameba7531');
const trait = Core.trait;
const recordType = Core.recordType;
const createRecord = require('ameba-util').createRecord;

const HasLocation = trait('HasLocation', [Core.listField('location', Core.Types.NumberType)]);
const Company = recordType('Company', [Core.textField('name', { isRequired: true }), Core.enumerationField('enum', ['ok', 'ko'], {defaultValue:'ok'})], { traits: [HasLocation] });
const c = createRecord(Company, { name: 'Com', location: [35, 140], enum: 'ko' });

console.log(Core.Types.RecordType);
st.save(Core.Types.RecordType).then(() => st.close());

const x = { a: 1 };
const shadow = { updatedFieldIds: [] };
Object.defineProperty(shadow, 'updatedFieldIds', {
  configurable: false,
  enumerable: false,
  writable: false,
});

Object.defineProperty(shadow, 'a', {
  configurable: false,
  enumerable: true,
  get: () => x.a,
  set: (a) => {
    if (x.a !== a) {
      shadow.updatedFieldIds.push('a');
      x.a = a;
    }
  },
});
shadow.a = 2;
Object.keys(shadow).map(f => shadow[f]).forEach(x => console.log(x));

/**
 * -authenticate +
 * -storedRecord +
 * -getByReference ++
 * -test +
 * -RecordTypeCache and RecordTypeStore  ++
 * -ValidatorField ++
 * -autoIncrement, Unique +
 * -JSONRPC spec ++
 */

/*
const Core = require('ameba-core');
const createStore = require('./mongodb-store/create-store');
const createConnection = require('./mongodb-store/create-connection');
const util = require('ameba-util');

const createRecord = util.createRecord;
const RecordType = Core.RecordType;
const NumberField = Core.NumberField;
const RecordField = Core.RecordField;
const TextField = Core.TextField;
const Trait = Core.Trait;

const R = RecordType('R', [NumberField('num', { defaultValue: 30 })]);
const HasLocation = Trait('HasLocation', [NumberField('latitude'), NumberField('longitude')]);
const HasAddress = Trait('HasAddress', [TextField('prefecture'), TextField('city'), TextField('street')]);
const Shop = RecordType('Shop', [TextField('name'), RecordField('record', RecordType)], { baseType: R, traits: [HasAddress, HasLocation] });


const store = createStore(createConnection('mongodb://127.0.0.1:27017/ameba', 'User', 'password'));

const shop = createRecord(Shop, { id: 'Test商店', num: 120, name: 'Test商店', prefecture: '東京都', city: '五反田', street: '3-1212', latitude: 35, longitude: 140, record: R });
shop._id = '58fb845a3f5fb813e573a9cd';
store.delete(shop)
  .then((r) => {
    console.log(r);
    store.close();
  }).catch((e) => {
    store.close();
    throw e;
  });
*/
const store = require('./lib/mongodb-store')();
module.exports = store;

const Core = require('ameba-core');
const RecordType = Core.RecordType;
const NumberField = Core.NumberField;
const Module = Core.Module;
const Trait = Core.Trait;

const m = Module('Test');
const t = Trait(m, 'aaaaa', [NumberField('num')]);//IsTraitField
const type = RecordType(m, 'test', [], {traits: [t]});


store.save(type).then(function (result) {
    console.log(result);
}).catch(function (e) {
    console.log(e);
})
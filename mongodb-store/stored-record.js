const getHierarchyFields = require('ameba-util').getHierarchyFields;

function hasChanged(wrapper, fieldId) {
  return wrapper.updatedFieldIds.indexOf(fieldId) > -1;
}

function storedRecord(wrapped) {
  const result = { updatedFieldIds: [] };
  const assignedValues = {};

  function attachFieldPropertyDescriptor(wrapper, fieldId) {
    Object.defineProperty(wrapper, fieldId, {
      configurable: false,
      enumerable: true,
      get: () => {
        if (hasChanged(wrapper, fieldId)) {
          return assignedValues[fieldId];
        }

        return wrapped[fieldId];
      },
      set: (value) => {
        if (wrapped[fieldId] !== value) {
          if (!hasChanged(wrapper, fieldId)) {
            wrapper.updatedFieldIds.push(fieldId);
          }

          assignedValues[fieldId] = value;
        }
      },
    });
  }

  Object.defineProperty(result, 'updatedFieldIds', {
    configurable: false,
    enumerable: false,
    writable: false,
  });

  getHierarchyFields(wrapped.type).forEach(f => attachFieldPropertyDescriptor(result, f.id));
}

module.exports = storedRecord;

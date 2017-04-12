import Immutable from 'immutable';

export function createTableType(typeName, functions) {
  return {
    get name() {
      return typeName;
    },
    parse,
    create
  };

  function parse(field, parseField) {
    return create(field.get('label'), field.get('options'));
  }

  function create(label, options) {
    options = Immutable.fromJS(options);

    return {
      get label() {
        return label;
      },

      get typeName() {
        return typeName;
      },

      getHeaderCell() {
        return label;
      },

      getCell(getters) {
        return functions.getCell(options, getters);
      },

      getRowCell(getters) {
        return functions.getRow(options, getters);
      }
    };
  }
}


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
    return {
      get typeName() {
        return typeName;
      },

      getHeaderCell() {
        return label;
      },

      getRowCell(getters) {
        return functions.getRow(options, getters);
      }
    };
  }
}


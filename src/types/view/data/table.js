import DataType from './';

/**
 * @extends src/types/view/data/index.js~DataType
 */
export default class TableType extends DataType {
  static typeName = 'table';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('columns', columns => columns && columns
        .map(parseField)
      );
  }

  getColumns() {
    return this.options.get('columns');
  }
}


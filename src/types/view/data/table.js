import DataType from './';

export default class TableType extends DataType {
  static typeName = 'table';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('columns', columns => columns
        .map(parseField)
      );
  }

  getColumns() {
    return this.options.get('columns');
  }
}


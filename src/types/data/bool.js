import DataType from './';

export default class BoolType extends DataType {
  static typeName = 'bool';

  getDefaultValue() {
    return super.getDefaultValue(false);
  }

  getDisplay(value) {
    return this.getValue(value) ?
      'Yes' :
      'No';
  }
}


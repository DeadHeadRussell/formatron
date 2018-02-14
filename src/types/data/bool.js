import DataType from './';

/**
 * The DataType for boolean values.
 * @extends {DataType}
 */
export default class BoolType extends DataType {
  static typeName = 'bool';

  /**
   * Default value is `false`
   * @return {boolean} The default bool value.
   */
  getDefaultValue() {
    return super.getDefaultValue(false);
  }

  /**
   * @deprecated New ViewTypes will take over this functionality.
   */
  getDisplay(value) {
    return this.getValue(value) ?
      'Yes' :
      'No';
  }
}


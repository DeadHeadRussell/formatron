import {Map} from 'immutable';

import ImmutableListType from './list';

/**
 * The DataType for dictionary values using Immutable.js.
 *
 * @param {Object} options
 * @param {DataType} options.keyType - The DataType to use for keys
 * @param {DataType} options.valueType - The DataType to use for values
 */
export default class ImmutableDictType extends ImmutableListType {
  static typeName = 'dict';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('keyType', parsefield)
      .update('valueType', parseField);
  }

  isOfType(value) {
    return Map.isMap(value);
  }

  getDefaultValue() {
    return super.getDefaultValue(Map());
  }

  getKeyType() {
    return this.options.get('keyType');
  }

  getValueType() {
    return this.options.get('valueType');
  }

  getItemType() {
    return this.getValueType();
  }
}


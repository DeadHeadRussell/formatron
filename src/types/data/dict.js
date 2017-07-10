import {Map} from 'immutable';

import ImmutableListType from './list';

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
    return this.options.get('itemType');
  }
}


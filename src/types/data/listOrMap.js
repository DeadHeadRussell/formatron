import * as Types from '../';
import {ImmutableDataType} from './';

import ImmutableListType from './list';
import ImmutableMapType from './map';

/**
 * A data type that can handle a specified type of value, or a list of that
 * same type of value. Eg, a single / multi file upload data type could be
 * extended from this type.
 *
 * Note: This class cannot be parsed into directly, and must be inherited from to use.
 *
 * Allowed options:
 *
 * |Name|Type|Attribute|Description|
 * |----|----|---------|-----------|
 * |multi|{@link boolean}| <ul><li>optional</li><li>default: false</li></ul> | Specifies whether this data type holds one or multiple values. |
 *
 * @extends {ImmutableDataType}
 *
 * @todo See if this is really the best method. Possible alternative is just using single / list types.
 */
export default class ImmutableListOrMapType extends ImmutableDataType {
  static typeName = '';

  constructor(name, options, dataTypes) {
    super(name, options);

    this.itemType = new Types.data.map(this.getName(), this.options
      .set('data', dataTypes)
    );

    this.listType = new Types.data.list(this.getName(), this.options
      .set('itemType', this.itemType)
    );

    this.type = this.isMulti() ?
      this.listType :
      this.itemType;
  }

  initialize(value, renderOptions) {
    if (this.type.initialize) {
      this.type.initialize(this.getValue(value), renderOptions);
    }
  }

  isMulti() {
    return this.options.get('multi');
  }

  getDefaultValue() {
    return this.type.getDefaultValue();
  }

  hasValue(model, checkDefault) {
    return this.type.hasValue(model, checkDefault);
  }

  getValue(model, ref, renderOptions) {
    return this.type.getValue(model, ref, renderOptions);
  }

  getMapDisplay(model, renderOptions) {
    return this.itemType.getDisplay(model, renderOptions);
  }

  getDisplay(model, renderOptions) {
    if (this.isMulti()) {
      return model
        .map(value => this.getMapDisplay(value, renderOptions))
        .join(', ');
    } else {
      return this.getMapDisplay(value, renderOptions);
    }
  }

  getField(refs, renderOptions) {
    return this.type.getField(refs, renderOptions);
  }

  getFieldAndValue(model, refs, renderOptions) {
    return this.type.getFieldAndValue(model, refs, renderOptions);
  }

  setValue(model, refs, newValue, renderOptions) {
    return this.type.setValue(model, refs, newValue, renderOptions);
  }

  validate(model) {
    return this.type.validate(model);
  }
}


import * as Types from '../';
import {ImmutableDataType} from './';

import ImmutableListType from './list';
import ImmutableMapType from './map';

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

  isMulti() {
    return this.options.get('multi');
  }

  getDefaultValue() {
    return this.type.getDefaultValue();
  }

  hasValue(model) {
    return this.type.hasValue(model);
  }

  getValue(model, ref) {
    return this.type.getValue(model, ref);
  }

  getMapDisplay(model) {
    return this.itemType.getDisplay(model);
  }

  getDisplay(model) {
    if (this.isMulti()) {
      return model
        .map(value => this.getMapDisplay(value))
        .join(', ');
    } else {
      return this.getMapDisplay(value);
    }
  }

  getField(refs) {
    return this.type.getField(refs);
  }

  getFieldAndValue(model, refs) {
    return this.type.getFieldAndValue(model, refs);
  }

  setValue(model, refs, newValue) {
    return this.type.setValue(model, refs, newValue);
  }

  validate(model) {
    return this.type.validate(model);
  }
}


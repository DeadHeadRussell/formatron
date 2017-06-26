import {Map} from 'immutable';

import {ImmutableDataType} from './';

export class ImmutableMapDataType extends ImmutableDataType {
  static name = 'map';

  constructor(name, options) {
    super(name, options);
  }

  getDefaultValue() {
    return Map();
  }

  hasValue(value) {
    if (!super.hasValue(value)) {
      return false;
    }
    return value && value.size > 0;
  }

  getField(refs) {
    if (!refs || (List.isList(refs) && refs.size == 0)) {
      return null;
    }

    if (typeof refs == 'string') {
      refs = List([refs]);
    }

    const firstRef = refs.first();
    const field = this.options
      .get('data')
      .map(fieldData => fieldData.get('field'))
      .find(field => field.name == firstRef);

    this.getNextField(field, refs.rest());
  }

  getFieldAndValue(model, refs) {
    if (!refs || (List.isList(refs) && refs.size == 0)) {
      return {};
    }

    if (!model) {
      return {field: this.getDataField(refs)};
    }

    if (typeof refs == 'string') {
      refs = List([refs]);
    }

    const firstRef = refs.first();
    const fieldData = this.options
      .get('data')
      .find(fieldData => fieldData.get('field').name == firstRef);

    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${model}"`);
    }
    
    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const value = model.getIn(path);

    return this.getNextDataFieldAndValue(field, value, refs.rest());
  }

  setValue(model, refs, newValue) {
    if (!model) {
      throw new Error('Invalid arguments to setDataValue: model = null');
    }

    if (!refs || (List.isList(refs) && refs.size == 0)) {
      throw new Error(`Invalid arguments to setDataValue: refs = ${refs}`);
    }

    if (typeof refs == 'string') {
      refs = List([refs]);
    }

    const firstRef = refs.first();
    const fieldData = this.options
      .get('data')
      .find(fieldData => fieldData.get('field').name == firstRef);

    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${model}"`);
    }

    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const oldValue = model.getIn(path);

    return model
      .setIn(path, this
        .setNextValue(field, oldValue, newValue, refs.rest())
      );
  }
}


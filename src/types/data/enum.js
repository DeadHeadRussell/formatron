import {List, Map} from 'immutable';

import DataType, {validationErrors} from './';
import ValidationError from './validationError';

export default class EnumType extends DataType {
  static typeName = 'enum';

  static parseOptions(field, parseField) {
    return super.parseOptions(field)
      .update('values', values => values
        .map(value => typeof value == 'string' ?
          Map({value, label: value}) :
          value
        )
      );
  }

  isMulti() {
    return this.options.get('multi', false);
  }

  getValues() {
    return this.options.get('values', List());
  }

  hasValue(value, checkDefault) {
    if (this.isMulti()) {
      return value && value.size > 0;
    } else {
      return super.hasValue(value, checkDefault);
    }
  }

  getDefaultValue() {
    if (this.isMulti()) {
      return super.getDefaultValue(List());
    } else {
      return super.getDefaultValue();
    }
  }

  getDisplay(value) {
    if (this.isMulti()) {
      value = value || List();
      return this.getValues()
        .filter(option => value.includes(option.get('value')))
        .map(option => option.get('label'))
        .join(', ');
    } else {
      const option = this.getValues()
        .find(option => option.get('value') == value);
      return option ?
        option.get('label') :
        '';
    }
  }

  validate(value) {
    return super.validate(value, () => {
      if (this.isMulti()) {
        const selection = this.getValues()
          .filter(option => value.includes(option.get('value')));

        if (value.size != selection.size) {
          return new ValidationError(validationErrors.invalidOption, this, value);
        }
      } else {
        const option = this.getValues()
          .find(option => option.get('value') == value);

        if (!option) {
          return new ValidationError(validationErrors.invalidOption, this, value);
        }
      }
    });
  }
}


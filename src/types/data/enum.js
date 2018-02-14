import {List, Map} from 'immutable';

import DataType, {validationErrors} from './';
import ValidationError from './validationError';

/**
 * @todo Split this into MultiEnumType and EnumType.
 *
 * DataType for enumerated values.
 * @extends {DataType}
 *
 * Allowed options:
 * |Name|Type|Attribute|Description|
 * |----|----|---------|-----------|
 * |multi| {@link boolean} | <ul><li>optional</li><li>default: false</li></ul> | Specifies whether this enum value holds one or multiple values. |
 * |values| {@link Object}[] \| {@link string}[] | | The list of enum values. If a list of strings is passed in, each string is interpreted as both the value and the label. |
 * |values.value| {@link string} | | The unique value used by Formatron to identify this enum value. |
 * |values.label| {@link string} | | The value used to display this enum to the user. |
 */
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


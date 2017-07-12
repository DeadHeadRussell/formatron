import Immutable, {List, Map} from 'immutable';

import Type from '../type';
import ValidationError from './validationError';

/**
 * A set of standard validation errors that registered types can use.
 *
 * TODO: Add a better way to modify the basic error messages other than just
 * editing the imported object, which is baaaaad.
 */
export const validationErrors = {
  required: 'This field is required',
  undefinedValue: 'This field is in a bad state. Please change the value and try again',
  invalidOption: 'The value selected does not exist',
  integer: 'This field must be an integer',
  finite: 'This field must be a finite number',
  email: 'This field must be an email address',
  url: 'This field must be a URL',
  ssn: 'This field must be a valid SSN',
  tel: 'This field must be a valid US telephone number',
  zipCode: 'This field must be a valid US Zip Code',
  singleline: 'This field must contain just one line of text'
};

/**
 * The base data type. Every registered data type must eventually inherit from this.
 */
export default class DataType extends Type {
  /** The data type name. This must be overridden. */
  static typeName = '';

  static parse(field, parseField) {
    field = Immutable.fromJS(field);
    return new this(
      field.get('name'),
      this.parseOptions(field.get('options'), parseField)
    );
  }

  /**
   * Creates a new instance of a data type.
   * @param {string} name - The unique name of this instance.
   * @param {object} options - Options to apply to this instance.
   */
  constructor(name, options) {
    super();
    this.name = name;
    this.options = Immutable.fromJS(options || {});
  }

  getName() {
    return this.name;
  }

  getOptions() {
    return this.options();
  }

  isRequired() {
    return this.options.get('required', false);
  }

  isUnique() {
    return this.options.get('unique', false);
  }

  isGenerated() {
    return this.options.get('generated', false);
  }

  getDefaultValue(defaultValue = null) {
    const optionsDefaultValue = this.options.get('defaultValue');
    return typeof optionsDefaultValue == 'undefined' ?
      defaultValue :
      optionsDefaultValue;
  }

  getValidator() {
    return this.options.get('validator', () => {});
  }

  getValidationLinks() {
    return this.options.get('validationLinks', List());
  }

  /**
   * Checks if the passed in value is "not empty".
   * @param {object} value - The data value to check.
   * @returns {bool} `true` if it is "not empty", otherwise, `false`.
   */
  hasValue(value) {
    if (typeof value == 'undefined' || value === null) {
      return false;
    }
    return true;
  }

  /**
   * Returns a parsed value. A value of `undefined` implies that the value is
   * missing and should be filled in by a default value, first supplied in the
   * options, and if not, the one supplied by the type.
   * @params {object} value - The data value to parse.
   */
  getValue(value, defaultValue) {
    const values = this.isGenerated() ?
      [value] :
      [
        value,
        this.getDefaultValue(defaultValue)
      ];

    return values
      .find(value => typeof value != 'undefined');
  }

  // TODO: For the following two functions, potentially look at the ref and
  // throw an error if they try to reference child types when there are none?
  getField(ref) {
    return this;
  }

  getFieldAndValue(value, ref) {
    return {
      field: this,
      value: this.getValue(value)
    };
  }

  /**
   * Returns the value parsed for human consumption.
   * @params {object} value - The data value to parse.
   * @returns {string} The parsed value.
   */
  getDisplay(value) {
    value = this.getValue(value);
    return (value && value.toString) ? value.toString() : '';
  }

  /**
   * Validates that the given value follows the rules of the data type.
   * @params {object} value - The value to validate.
   * @returns An error if one was found, undefined otherwise.
   */
  validate(value, callback) {
    value = this.getValue(value);

    if (value == this.getDefaultValue()) {
      return;
    }

    if (!this.hasValue(value)) {
      if (this.isGenerated()) {
        return;
      } else if (this.isRequired()) {
        return new ValidationError(validationErrors.required, this, value);
      } else {
        return;
      }
    }

    if (callback) {
      return callback();
    }
  }

  filter(filterValue, rowValue) {
    return filterValue == rowValue;
  }
}

export class ImmutableDataType extends DataType {
  static typeName = '';

  hasValue(value) {
    if (!super.hasValue(value)) {
      return false;
    }
    return value && value.size > 0;
  }

  getValue(value, ref) {
    value = super.getValue(value);
    if (ref) {
      return this.getFieldAndValue(value, ref).value;
    }
    return value;
  }

  getField(ref) {
    throw new Error('`getField` is not implemented');
  }

  getNextField(field, refs) {
    if (refs.size == 0) {
      return field;
    } else {
      if (field && field.getField) {
        return field.getField(refs);
      }
      throw new Error(`Cannot call "getField" "${field.name}" of data type "${field.constructor}"`);
    }
  }

  getFieldAndValue(value, ref) {
    throw new Error('`getFieldAndValue` is not implemented');
  }

  getNextFieldAndValue(field, value, refs) {
    if (refs.size == 0) {
      return {field, value};
    } else {
      if (field && field.getFieldAndValue) {
        return field.getFieldAndValue(value, refs);
      }
      throw new Error(`Cannot call "getFieldAndValue" for "${field.name}" of data type "${field.constructor}"`);
    }
  }

  setValue(value, ref, newValue) {
    throw new Error('`setField` is not implemented');
  }

  setNextValue(field, oldValue, newValue, refs) {
    if (refs.size == 0) {
      return newValue;
    } else {
      if (field.setValue) {
        return field.setValue(oldValue, refs, newValue);
      }
      throw new Error(`Cannot call "setValue" for "${field.name}" of data type "${field.constructor}"`);
    }
  }
}


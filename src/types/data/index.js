import {Map} from 'immutable';

import './index.sass';

export const validationErrors = {
  required: 'This field is required',
  undefinedValue: 'This field has an undefined value',
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
export default class DataType {
  /** The data type name. This must be overridden. */
  static name = '';

  /** Parses a JS or Immutable.js object into a data type. */
  static parse = field => {
    field = Map(field);
    return new DataType(field.get('name'), field.get('options'));
  }

  /**
   * Creates a new instance of a data type.
   * @param {string} name - The unique name of this instance.
   * @param {object} options - Options to apply to this instance.
   */
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.type = this.constructor.name;

    if (this.constructor == DataType) {
      throw new Error('Cannot instantiate DataType');
    }
  }

  /** Returns the default value for this data type. */
  getDefaultValue() {
    return null;
  }

  /**
   * Checks if the passed in value is "not empty".
   * @param {object} value - The data value to check.
   * @returns {bool} `true` if it is "not empty", otherwise, `false`.
   */
  hasValue(value) {
    if (typeof value == 'undefined') {
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
  getValue(value) {
    const values = this.options.get('generated') ?
      [value] :
      [
        value,
        this.options.get('defaultValue'),
        this.getDefaultValue()
      ];

    return values
      .find(value => typeof value != 'undefined');
  }

  /**
   * Returns the value parsed for human consumption.
   * @params {object} value - The data value to parse.
   * @returns {string} The parsed value.
   */
  getLabel(value) {
    value = this.getValue(value);
    return (value && value.toString) ? value.toString() : '';
  }

  /**
   * Validates that the given value follows the rules of the data type.
   * @params {object} value - The value to validate.
   * @returns Nothing.
   * @throws An error if the value does not validate. The error message explains why.
   */
  validate(value) {
    if (typeof value == 'undefined') {
      if (!this.options.get('generated')) {
        throw new Error(validationErrors.undefinedValue);
      }
      return;
    }

    if (!this.hasValue(value)) {
      if (!options.get('generated') && options.get('required')) {
        throw new Error(validationErrors.requierd);
      }
      return;
    }
  }
}

export class ImmutableDataType extends DataType {
  static name = '';

  constructor(name, options) {
    super(name, options);

    if (this.constructor == ImmutableDataType) {
      throw new Error('Cannot instantiate ImmutableDataType');
    }
  }

  getDefaultValue() {
    throw new Error('`getDefaultValue` is not implemented');
  }

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
      } else {
        throw new Error(`Cannot call "getField" "${field.name}" of data type "${field.type}"`);
      }
    }
  }

  getFieldAndValue(value, ref) {
    throw new Error('`getFieldAndValue` is not implemented');
  }

  getNextFieldAndValue(field, value, refs) {
    if (refs.size == 0) {
      return {field, value};
    } else {
      if (field.getFieldAndValue) {
        const model = field.getModel ?
          field.getModel(value) :
          value;
        return field.getFieldAndValue(model, refs);
      } else {
        throw new Error(`Cannot call "getFieldAndValue" for "${field.name}" of data type "${field.type}"`);
      }
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
        const model = field.getModel ?
          field.getModel(value) :
          value;
        return field.setDataValue(model, refs, newValue);
      } else {
        throw new Error(`Cannot call "setValue" for "${field.name}" of data type "${field.type}"`);
      }
    }
  }
}


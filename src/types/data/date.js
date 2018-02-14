import moment from 'moment';

import {convertDate} from '~/utils';

import DataType from './';

/**
 * The DataType for date values. Stores a value of seconds since January 1st 1970.
 *
 * Allowed options:
 *
 * |Name|Type|Attribute|Description|
 * |----|----|---------|-----------|
 * |dateType|{@link string}| <ul><li>optional</li><li>default: 'datetime'</li></ul> | Whether to handle just a date, time or both. 'date' &vert; 'time' &vert; 'datetime' |
 *
 * @extends {DataType}
 */
export default class DateType extends DataType {
  static typeName = 'date';

  /**
   * @return <string> "date" | "time" | "datetime"
   */
  getType() {
    return this.options.get('dateType', 'datetime');
  }

  /**
   * @deprecated Will be moved to ViewType
   */
  getFormat() {
    return this.options.get('format', this.getDefaultFormat());
  }

  /**
   * @deprecated Will be moved to ViewType
   */
  getDefaultFormat() {
    switch (this.getType()) {
      case 'time':
        return 'hh:mm a';
      case 'date':
        return 'YYYY-MM-DD';
      case 'datetime':
      default:
        return 'YYYY-MM-DD hh:mm a';
    }
  }

  /**
   * Converts between strings, JS Date objects, moment objects, or unix time values.
   *
   * @param {string|Date|moment|number} value - The date value to convert
   * @param {string} [toType='string'|'datetime'|'unix'] - The type to convert to.
   * @return {string|moment|number} The date value in a new format.
   */
  convert(value, toType) {
    return convertDate(value, toType, {
      type: this.getType(),
      format: this.getFormat()
    });
  }

  /**
   * Checks if the passed in value holds a valid date value.
   * @param {any} value - The date value
   * @return {boolean}
   */
  hasValue(value) {
    if (!super.hasValue(value)) {
      return false;
    }
    if (value instanceof moment && !value.isValid()) {
      return false;
    }
    return true;
  }

  /**
   * See {@link DataType#getValue}.
   */
  getValue(value) {
    return super.getValue(this.convert(value, 'unix'));
  }

  /**
   * @deprecated Will be moved to view types.
   */
  getDisplay(value) {
    value = this.getValue(value);
    return this.convert(value, 'string');
  }

  /**
   * @deprecated Filtering will be refactored to its own module.
   */
  filter(filterValue, rowValue) {
    const lowerInput = this.convert(filterValue.get('lower'), 'unix');
    const upperInput = this.convert(filterValue.get('upper'), 'unix');

    const lower = Number.isFinite(lowerInput) ? lowerInput : -Infinity;
    const upper = Number.isFinite(upperInput) ? upperInput : Infinity;
    return rowValue >= lower && rowValue <= upper;
  }
}


import {List} from 'immutable';

import DataType from './';

export default class DropDownType extends DataType {
  static typeName = 'dropDown';

  /**
   * Returns if this display should allow picking multiple items or not.
   * @param {DataType} dataType - An optional data type to provide.
   * @returns {bool} `true` if this should allow picking multiple options.
   */
  isMulti(dataType) {
    if (this.options.has('multi')) {
      return this.options.get('multi');
    } else if (dataType && dataType.isMulti) {
      return dataType.isMulti();
    }
    return false;
  }

  /**
   * Returns a list of avaliable options in the drop down, either specified in
   * this view type's options, or in the passed in data type.
   * @param {DataType} dataType - An optional data type to check for options.
   * @returns {Immutable.List} a list of options.
   */
  getOptions(dataType) {
    if (this.options.has('options')) {
      return this.options.get('options', List());
    } else if (dataType && dataType.getValues) {
      return dataType.getValues() || List();
    }
    return List();
  }

  /**
   * Allows subtypes to define filter options for faster searches. Returns
   * undefined so that the default filter options are used.
   * @returns The filter options.
   */
  getFilterOptions() {
    return undefined;
  }
}


import {List} from 'immutable';

import DataType from './';

export default class DropDownType extends DataType {
  static typeName = 'dropDown';

  /**
   * Supports async loading of options. The `getOptions` method will then be
   * passed a second argument of the current drop down text input. The return
   * value is expected to be a promise.
   * @params {DataType} dataType - The data type to provide.
   * @returns {bool} `true` if the options are loaded asynchronously.
   */
  isAsync(dataType) {
    return dataType.isAsync
      ? dataType.isAsync()
      : false;
  }

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
   * @param {string} input - If async, the input entered to return options for.
   * @returns {Immutable.List} a list of options.
   */
  getOptions(dataType, input) {
    if (this.options.has('options')) {
      return this.options.get('options', List());
    } else if (dataType && dataType.getValues) {
      return dataType.getValues(input) || List();
    }
    return List();
  }

  /**
   * Allows subtypes to define filter options for faster searches. Returns
   * undefined so that the default filter options are used.
   * @returns The filter options.
   */
  getFilterOptions(dataType) {
    return dataType.getFilterOptions
      ? dataType.getFilterOptions()
      : undefined;
  }
}


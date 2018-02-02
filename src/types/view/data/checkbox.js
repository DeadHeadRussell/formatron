import DataType from './';

/**
 * @extends src/types/view/data/index.js~DataType
 */
export default class CheckboxType extends DataType {
  static typeName = 'checkbox';

  useInputWidth() {
    return this.options.get('useInputWidth');
  }

  getFormClasses() {
    return {
      'formatron-checkbox-input-width': this.useInputWidth()
    };
  }
}


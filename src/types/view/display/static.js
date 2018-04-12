import DisplayType from './';

/**
 * @extends DisplayType
 */
export default class StaticType extends DisplayType {
  static typeName = 'static';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('display', parseField);
  }

  initialize(renderData) {
    return super.initialize(renderData, this.getDisplay());
  }

  getDisplay() {
    return this.options.get('display');
  }
}


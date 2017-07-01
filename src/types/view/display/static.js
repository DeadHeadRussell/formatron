import DisplayType from './';

export default class StaticType extends DisplayType {
  static typeName = 'static';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('display', parseField);
  }

  getDisplay() {
    return this.options.get('display');
  }
}


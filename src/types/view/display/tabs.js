import DisplayType from './';

export default class TabsType extends DisplayType {
  static typeName = 'tabs';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('tabs', tabs => tabs
        .map(tab => tab
          .update('display', parseField)
        )
      );
  }

  getTabs() {
    return this.options.get('tabs');
  }
}


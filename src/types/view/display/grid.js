import DisplayType from './';

export default class GridType extends DisplayType {
  static typeName = 'grid';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('children', children => children
        .map(this.parseOneOrMany(parseField))
      );
  }

  getOrientation() {
    return this.options.get('orientation', 'horizontal');
  }

  getChildren() {
    return this.options.get('children');
  }
}


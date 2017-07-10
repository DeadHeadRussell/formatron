import {List} from 'immutable';

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
    return this.options.get('orientation', 'vertical');
  }

  getChildren() {
    return this.options.get('children');
  }

  getDisplay(renderData, renderers) {
    // TODO: Refine the shit out of this.
    return this.getChildren()
      .map(viewType => List.isList(viewType) ? (
        viewType
          .map(viewType =>
            renderers.getDisplay(viewType, renderData)
          )
      ) : (
        renderers.getDisplay(viewType, renderData)
      ))
      .filter(value => value)
      .join(', ');
  }
}


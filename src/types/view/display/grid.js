import {List} from 'immutable';

import {valueRenderers} from '~/renderers';

import DisplayType from './';

/**
 * @extends DisplayType
 */
export default class GridType extends DisplayType {
  static typeName = 'grid';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('children', children => children
        .map(this.parseOneOrMany(parseField))
      );
  }

  initialize(renderData) {
    return super.initialize(renderData, this.getChildren()
      .flatten(true)
    );
  }

  getOrientation() {
    return this.options.get('orientation') || 'vertical';
  }

  getChildren() {
    return this.options.get('children');
  }

  getDisplay(renderData) {
    // TODO: Refine the shit out of this.
    return this.getChildren()
      .map(viewType => List.isList(viewType) ? (
        viewType
          .map(viewType =>
            valueRenderers.getDisplay(viewType, renderData)
          )
      ) : (
        valueRenderers.getDisplay(viewType, renderData)
      ))
      .filter(value => value)
      .join(', ');
  }
}


import {List} from 'immutable';

import ViewType from './';

export default class ButtonType extends ViewType {
  static typeName = 'button';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', List(), args => args);
  }

  getArgs() {
    return this.options.get('args') || List();
  }

  getValue(renderData) {
    return this.getLabel(renderData);
  }

  getDisplay(renderData) {
    return this.getValue(renderData);
  }

  getTableProps() {
    return super.getTableProps('');
  }
}


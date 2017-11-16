import {List} from 'immutable';

import ViewType from './';

export default class ButtonType extends ViewType {
  static typeName = 'button';

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

  onClick(e, renderData) {
    const args = this.getArgs().toArray();
    renderData.options.onButtonClick(...args);
  }
}


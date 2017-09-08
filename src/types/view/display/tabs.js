import {Map} from 'immutable';

import DisplayType from './';

export default class TabsType extends DisplayType {
  static typeName = 'tabs';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('tabs', tabs => tabs
        .map(tab => tab
          .update('label', label => Map.isMap(label) ?
            parseField(label) :
            label
          )
          .update('display', parseField)
        )
      );
  }

  initialize(renderData) {
    super.initialize(renderData, this.getTabs()
      .map(tab => tab.get('display'))
    );
  }

  getTabs() {
    return this.options.get('tabs');
  }

  getTabLabel(tab, renderData) {
    return this.getLabel(renderData, tab.get('label'));
  }
}


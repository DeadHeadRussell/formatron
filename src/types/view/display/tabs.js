import {Map} from 'immutable';

import {valueRenderers} from '~/renderers';

import ViewType from '../';
import DisplayType from './';

/**
 * @extends DisplayType
 */
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
    return super.initialize(renderData, this.getTabs()
      .filter(tab => tab.get('label') instanceof ViewType)
      .map(tab => tab.get('label'))
    );
  }

  loadTab(tabIndex, renderData) {
    const tab = this.getTabs().get(tabIndex);
    return valueRenderers.initialize(tab.get('display'), renderData);
  }

  getTabs() {
    return this.options.get('tabs');
  }

  getTabLabel(tab, renderData) {
    return this.getLabel(renderData, tab.get('label'));
  }
}


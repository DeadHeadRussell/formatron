import {valueRenderers} from '~/renderers';

import ValueType from './';

export default class SwitchType extends ValueType {
  static typeName = 'switch';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('switch', parseField)
      .update('cases', cases => cases
        .map(caseField => caseField
          .update('case', parseField)
          .update('display', parseField)
        )
      )
      .update('defaultDisplay', field => field && parseField(field));
  }

  initialize(renderData) {
    super.initialize(renderData, this.getSwitch());
    super.initialize(renderData, this.getCases()
      .map(caseField => caseField.get('case'))
    );

    // Allow some case displays to fail since they may not be intended for the
    // current value. However, since not all data may have been loaded yet, due
    // to this terrible initialize scheme, we cannot tell which case displays
    // to load, so we have to try to load them all.
    this.getCases()
      .map(caseField => caseField.get('display'))
      .forEach(display => {
        try {
          valueRenderers.initialize(display, renderData);
        } catch (e) {}
      });

    super.initialize(renderData, this.getDefaultDisplay());
  }

  getSwitch() {
    return this.options.get('switch');
  }

  getCases() {
    return this.options.get('cases');
  }

  getDefaultDisplay() {
    const defaultDisplay = this.options.get('defaultDisplay');
    return defaultDisplay || null;
  }

  /**
   * Returns the appropriate switch case based on the input render data.
   * @param {RenderData} renderData - The data to switch over.
   * @returns {ViewType} The resulting view type from the switch statement.
   */
  switch(renderData) {
    const switchValue = valueRenderers.getValue(this.getSwitch(), renderData);
    const caseField = this.getCases()
      .find(caseField =>
        valueRenderers.getValue(caseField.get('case'), renderData) == switchValue
      );

    if (caseField) {
      return caseField.get('display');
    }

    return this.getDefaultDisplay();
  }

  getValue(renderData) {
    const display = this.switch(renderData);
    return display ?
      valueRenderers.getValue(display, renderData) :
      null;
  }

  getDisplay(renderData) {
    const display = this.switch(renderData);
    return display ?
      valueRenderers.getDisplay(display, renderData) :
      null;
  }
}


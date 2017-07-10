import {List} from 'immutable';

import {valueRenderers} from '~/renderers';

import ViewType from '../';

export default class ValueType extends ViewType {
  static typeName = 'value';

  /**
   * Parses either a single or a list of children view types into their
   * associated values.
   * @param {RenderData} renderData - The render data to compute over.
   * @param {ViewType|List.<ViewType>} children - The child or children to parse.
   * @returns {object} The computed data.
   */
  getChildValues(renderData, children) {
    return List.isList(children) ?
      children.map(child => valueRenderers.getValue(child, renderData)) :
      valueRenderers.getValue(children, renderData);
  }

  /**
   * Returns the raw underlying value of this view type.
   * @param {RenderData} renderData - The data to compute on.
   * @returns {object} The computed value.
   */
  getValue(renderData) {
    return this.options.get('value', null);
  }

  /**
   * Returns the underlying value of this view type in a human consumable form.
   * @param {RenderData} renderData - The data to compute on.
   * @returns {object} The computed value.
   */
  getDisplay(renderData) {
    return this.getValue(renderData);
  }

  filter(filterValue, rowValue) {
    const filterString = `${filterValue}`.toLowerCase();
    const rowString = `${rowValue}`.toLowerCase();
    return rowString.indexOf(filterString) >= 0;
  }
}


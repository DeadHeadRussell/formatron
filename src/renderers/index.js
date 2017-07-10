import {Map} from 'immutable';

import ViewType from '~/types/view';

/**
 * Collection of render functions of a specific type (eg. React renderers).
 */
export default class Renderers {
  /**
   * Creates a new set of renderers for a set of types.
   * @param {object.<string, Renderer>} renderers - The set of renderers for each ViewType registered.
   */
  constructor(renderers) {
    this.renderers = renderers || {};
    this.cachedValues = Map();
  }

  /**
   * Registers a new renderer for a specific type.
   * @param {string} typeName - The name of the renderer to register.
   * @param {Renderer} renderer - The renderer to register.
   */
  register(typeName, renderer) {
    this.renderers[typeName] = renderer;
  }

  bustCache(type, viewType, dataValue) {
    const path = [type, viewType, dataValue];
    this.cachedValues.deleteIn(path);
  }

  cache(type, viewType, dataValue, create) {
    if (typeof viewType == 'string') {
      const path = [type, viewType, dataValue];
      this.cachedValues = this.cachedValues
        .updateIn(path, cachedView => cachedView ?
          cachedView :
          create()
        );
      return this.cachedValues.getIn(path);
    } else {
      return create();
    }
  }

  /**
   * See {@link Renderer#renderFormField}
   */
  renderFormField(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderFormField(viewType, renderData, this);
  }

  /**
   * See {@link Renderer#renderStaticField}
   */
  renderStaticField(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderStaticField(viewType, renderData, this);
  }

  /**
   * See {@link Renderer#renderFormFilter}
   */
  renderFormFilter(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderFormFilter(viewType, renderData, this);
  }

  /**
   * See {@link Renderer#renderFilter}
   */
  renderFilter(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderFilter(viewType, renderData, this);
  }

  /**
   * See {@link Renderer#renderTableCell}
   */
  renderTableCell(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderTableCell(viewType, renderData, this);
  }

  /**
   * See {@link Renderer#renderStaticTableCell}
   */
  renderStaticTableCell(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderStaticTableCell(viewType, renderData, this);
  }

  /**
   * Returns the raw data value that is represented by this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   */
  getValue(viewType, renderData) {
    return this.cache('value', viewType, renderData.dataValue, () => {
      viewType = this.parseViewType(viewType, renderData);
      return viewType.getValue(renderData, this);
    });
  }

  /**
   * Returns a "pretty" data value that is represented by this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   */
  getDisplay(viewType, renderData) {
    return this.cache('display', viewType, renderData.dataValue, () => {
      viewType = this.parseViewType(viewType, renderData);
      return viewType.getDisplay(renderData, this);
    });
  }

  /**
   * Returns a map of properties to use to display a table.
   * @params {ViewType} viewType - The view type to get the props of.
   */
  getTableProps(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return viewType.getTableProps();
  }

  /**
   * If the view type passed in is a string and if the `viewTypes` property
   * exists in the renderData options, attempt to look up the viewType by name.
   */
  parseViewType(viewType, renderData) {
    const viewTypes = this.getViewTypes(renderData);
    if (typeof viewType == 'string') {
      const lookup = viewTypes.get(viewType);
      if (lookup) {
        return lookup;
      }
    } else if (viewType instanceof ViewType) {
      return viewType;
    }

    throw new Error(`Invalid ViewType passed: ${viewType} (${viewTypes})`);
  }

  getViewTypes(renderData) {
    const viewTypes = typeof renderData.options.viewTypes == 'function' ?
      renderData.options.viewTypes(renderData) :
      renderData.options.viewTypes;

    return viewTypes || Map();
  }
}

export const valueRenderers = new Renderers();


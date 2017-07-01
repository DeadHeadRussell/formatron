import ViewType from '~/types/view';

/**
 * Collection of render functions of a specific type (eg. React renderers).
 */
export default class Renderers {
  /**
   * Creates a new renderer for a specific type
   * @param {object.string} renderers - The set of renderers for each ViewType registered.
   */
  constructor(renderers) {
    this.renderers = renderers;
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
   * See {@link Renderer#renderTableFilter}
   */
  renderFilter(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return this.renderers[viewType.constructor.typeName].renderTableFilter(viewType, renderData, this);
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
    viewType = this.parseViewType(viewType, renderData);
    return viewType.getValue(renderData, this);
  }

  /**
   * Returns a "pretty" data value that is represented by this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   */
  getDisplay(viewType, renderData) {
    viewType = this.parseViewType(viewType, renderData);
    return viewType.getDisplay(renderData, this);
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
    if (typeof viewType == 'string') {
      const viewTypes = renderData.options.viewTypes || {};
      const lookup = viewTypes.get(viewType);
      if (lookup) {
        return lookup;
      }
    } else if (viewType instanceof ViewType) {
      return viewType;
    }

    throw new Error(`Invalid ViewType passed: ${viewType}`);
  }
}

export const valueRenderers = new Renderers();


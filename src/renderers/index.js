//import jsonTypeRenderers from './json';
//import immutableTypeRenderers from './immutable';
import reactTypeRenderers from './react';
import RenderData from './renderData';

/**
 * Collection of render functions of a specific type (eg. React renderers).
 */
class Renderers {
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
    return this.renderers[viewType.name].renderFormField(viewType, renderData);
  }

  /**
   * See {@link Renderer#renderStaticField}
   */
  renderStaticField(viewType, renderData) {
  }

  /**
   * See {@link Renderer#renderTableHeader}
   */
  renderTableHeader(viewType, renderData) {
    return this.renderers[viewType.name].renderTableHeader(viewType, renderData);
  }

  /**
   * See {@link Renderer#renderTableFilter}
   */
  renderTableFilter(viewType, renderData) {
    return this.renderers[viewType.name].renderTableFilter(viewType, renderData);
  }

  /**
   * See {@link Renderer#renderTableCell}
   */
  renderTableCell(viewType, renderData) {
    return this.renderers[viewType.name].renderTableCell(viewType, renderData);
  }

  /**
   * See {@link Renderer#renderStaticTableCell}
   */
  renderStaticTableCell(viewType, renderData) {
    return this.renderers[viewType.name].renderStaticTableCell(viewType, renderData);
  }

  /**
   * Returns the raw data value that is represented by this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   */
  getValue(viewType, renderData) {
    return viewType.getValue(renderData);
  }

  /**
   * Returns a "pretty" data value that is represented by this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   */
  getLabel(viewType, renderData) {
    return viewType.getLabel(renderData);
  }
}

/**
 * A set of renderers to be used with React.js.
 */
export const reactRenderer = new Renderers(reactTypeRenderers);


/**
 * The renderer interface.
 */
export default class Renderer {
  constructor() {
    if (this.constructor == Renderer) {
      throw new Error('Cannot instantiate Renderer');
    }
  }

  /**
   * Renders an interactable form field for the viewType.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The rendered form field.
   */
  renderFormField(viewType, renderData) {}

  /**
   * Renders a non-interactable field for the viewType.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The rendered static field.
   */
  renderStaticField(viewType, renderData) {}

  /**
   * Renders an interactable field to be used for filtering this view type with
   * an accompanying form label.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The renderer form filter element.
   */
  renderFormFilter(viewType, renderData) {}

  /**
   * Renders an interactable field to be used for filtering this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The rendered table filter element.
   */
  renderFilter(viewType, renderData) {}

  /**
   * Renders an interactable field to be used in a table for this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The rendered table cell.
   */
  renderTableCell(viewType, renderData) {}

  /**
   * Renders a non-interactable field to be used in a table for this view type.
   * @params {ViewType} viewType - The view type to render.
   * @params {RenderData} renderData - The data to render.
   * @returns {object} The rendered table cell.
   */
  renderStaticTableCell(viewType, renderData) {}
}


/**
 * Struct that contains all information required for rendering.
 */
export default class RenderData {
  /**
   * Creates a new render data struct.
   *
   * @param {DataType} dataType - A description of the data value.
   * @param {object} dataValue - The data value to render.
   * @param {object} params - Arbitrary parameters to pass to the renderer.
   */
  constructor(dataType, dataValue, options) {
    /** @member {DataType} */
    this.dataType = dataType;

    /** @member {object} */
    this.model = model;

    /** @member {object} */
    this.options = options;
  }
}

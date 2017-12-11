/**
 * Struct that contains all information required for rendering.
 */
export default class RenderData {
  /**
   * Creates a new render data struct.
   *
   * @param {DataType} dataType - A description of the data value.
   * @param {object} dataValue - The data value to render.
   * @param {object} options - Arbitrary parameters to pass to the renderer.
   */
  constructor(dataType, dataValue, options = {}) {
    /** @member {DataType} */
    this.dataType = dataType;

    /** @member {object} */
    this.dataValue = dataValue;

    /** @member {object} */
    this.options = options;
  }

  /**
   * Creates a new render data struct with the passed in options added.
   *
   * @param {object} newOptions - Arbitrary parameters to pass to the renderer.
   * @returns {RenderData} - A new render data object.
   */
  addOptions(newOptions) {
    return new RenderData(this.dataType, this.dataValue, {
      ...this.options,
      ...newOptions
    });
  }
}

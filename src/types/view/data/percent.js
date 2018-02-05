import DataType from './';

/**
 * @extends src/types/view/data/index.js~DataType
 */
export default class PercentType extends DataType {
  static typeName = 'percent';

  getFieldAndValue(renderData) {
    const {field, value} = super.getFieldAndValue(renderData);
    return {
      field,
      value: value === null ?
        null :
        value * 100
    };
  }

  getDisplay(renderData) {
    const value = this.getValue(renderData);
    return value === null ?
      '' :
      `${value}%`;
  }

  parseInput(value) {
    return value === null ?
      null :
      value / 100;
  }
}


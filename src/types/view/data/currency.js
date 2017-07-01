import DataType from './';

export default class CurrencyType extends DataType {
  static typeName = 'currency';

  getDisplay(renderData) {
    const {field, value} = this.getFieldAndValue(renderData);
    if (!Number.isFinite(value)) {
      return '';
    } else {
      return value.toLocaleString({
        currency: 'en_us',
        currencyDisplay: 'name'
      });
    }
  }

  parseInput(displayValue) {
    if (typeof displayValue != 'string' || displayValue.length == 0) {
      return null;
    }
    const number = Number(displayValue.replace(/,/g, ''));
    if (Number.isFinite(number)) {
      return number;
    }
    return null;
  }
}


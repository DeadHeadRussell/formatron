import DataType, {validationErrors} from './';
import ValidationError from './validationError';

export default class NumberType extends DataType {
  static typeName = 'number';

  getType() {
    return this.options.get('type', 'raw');
  }

  getMin() {
    return this.options.get('min', -Infinity);
  }

  getMax() {
    return this.options.get('max', Infinity);
  }

  getDisplay(value) {
    if (typeof value != 'number') {
      return '';
    }

    switch (this.getType()) {
      case 'float':
        return value.toLocaleString('en-us', {
          maximumSignificantDigits: 5
        });

      case 'integer':
        return value.toLocaleString('en-us', {
          maximumFractionDigits: 0
        });

      case 'raw':
      default:
        return `${value}`;
    }
  }

  validate(value) {
    return super.validate(value, () => {
      if (!Number.isFinite(value)) {
        return new ValidationError(validationErrors.finite, this, value);
      }

      if (this.getType() == 'integer' && !Number.isInteger(value)) {
        return new ValidationError(validationErrors.integer, this, value);
      }

      const min = this.getMin();
      const max = this.getMax();
      if (value < min || value > max) {
        return new ValidationError(`This value must be between ${min} and ${max} inclusive`, this, value);
      }
    });
  }

  filter(filterValue, rowValue) {
    const lowerInput = filterValue.get('lower');
    const upperInput = filterValue.get('upper');

    const lower = Number.isFinite(lowerInput) ?
      lowerInput :
      -Infinity;

    const upper = Number.isFinite(upperInput) ?
      upperInput :
      Infinity;

    return rowValue >= lower && rowValue <= upper;
  }
}


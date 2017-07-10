import DataType, {validationErrors} from './';
import ValidationError from './validationError';

export default class NumberType extends DataType {
  static typeName = 'number';

  getType() {
    return this.options.get('type', 'raw');
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


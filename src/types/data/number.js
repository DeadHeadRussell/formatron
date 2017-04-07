import CurrencyInput from 'react-currency-input';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {validationErrors} from './';

export default function(register) {
  register('number', {
    component: NumberComponent,
    validate: validateNumber,
    toString: numberToString
  });
}

const NumberComponent = (props) => {
  switch (props.options.get('numberType')) {
    case 'percent':
      return <PercentComponent {...props} />;
    case 'currency':
      return <CurrencyComponent {...props} />;
    case 'integer':
    case 'float':
    case 'raw':
    default:
      return <NumberInputComponent {...props} />;
  }
};

NumberComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.number,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

const PercentComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <input
    className='form-data-input percent'
    name={name}
    type='text'
    disabled={disabled}
    value={numberToPercent(value)}
    placeholder={options.get('placeholder')}
    onChange={e => onChange(percentToNumber(e.target.value))}
    onBlur={onBlur}
  />;
};

function numberToPercent(number) {
  if (!Number.isFinite(number)) {
    return '';
  }
  return `${number}%`;
}

function percentToNumber(percent) {
  if (typeof percent != 'string' || percent.length == 0 || percent == '%') {
    return null;
  }
  const number = Number(percent.replace('%', ''));
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
}

const CurrencyComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <div className='form-currency'>
    <CurrencyInput
      className='form-data-input currency'
      name={name}
      disabled={disabled}
      value={numberToCurrency(value)}
      placeholder={options.get('placeholder')}
      onChange={value => onChange(currencyToNumber(value))}
      onBlur={onBlur}
    />
  </div>;
};

function numberToCurrency(number) {
  if (!Number.isFinite(number)) {
    return '';
  }
  return number.toFixed(2);
}

function currencyToNumber(currency) {
  if (typeof currency != 'string' || currency.length == 0) {
    return null;
  }
  const number = Number(currency.replace(/,/g, ''));
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
}

const NumberInputComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <input
    className='form-data-input number'
    name={name}
    type='number'
    disabled={disabled}
    value={numberToInput(value)}
    placeholder={options.get('placeholder')}
    onChange={e => onChange(inputToNumber(e.target.value))}
    onBlur={onBlur}
  />;
};

function numberToInput(number) {
  if (!Number.isFinite(number)) {
    return '';
  }
  return `${number}`;
}

function inputToNumber(input) {
  if (typeof input != 'string' || input.length == 0) {
    return null;
  }
  const number = Number(input);
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
}

function numberToString(value, options) {
  if (typeof value != 'number') {
    return '';
  }

  switch (options.get('numberType')) {
    case 'float':
      return value.toLocaleString('en-us', {
        maximumSignificantDigits: 5
      });

    case 'integer':
      return value.toLocaleString('en-us', {
        maximumFractionDigits: 0
      });

    case 'percent':
      return value.toLocaleString('en-us', {
        style: 'percent',
        maximumSignificantDigits: 5
      });

    case 'currency':
      return value.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD'
      });

    case 'raw':
    default:
      return value.toLocaleString('en-us');
  }
}

function validateNumber(value, options) {
  if (!Number.isFinite(value)) {
    throw new Error(validationErrors.finite);
  }

  const type = options.get('numberType');
  if (type == 'integer' && !Number.isInteger(value)) {
    throw new Error(validationErrors.integer);
  }
}


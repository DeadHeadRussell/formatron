import Immutable, {List, Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Select from 'react-select';

import {validationErrors} from './';

export default function (register) {
  register('enum', {
    parseOptions(options) {
      return options
        .update('values', values => List(values)
          .map(value => Map(value))
        );
    },
    component: EnumComponent,
    validate: validateEnum,
    toString: enumToString
  });
}

const EnumComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <Select
    className='form-data-input select single'
    name={name}
    value={valueToOption(value)}
    disabled={disabled}
    options={options.get('values')
      .unshift({
        label: '',
        value: null
      })
      .toJS()
    }
    onChange={option => onChange(optionToValue(option))}
    onBlur={onBlur}
  />;
};

EnumComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: ImmutablePropTypes.contains({
    value: React.PropTypes.number.isRequired
  }),
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function valueToOption(value) {
  return value ?
    value.get('value') :
    '';
}

function optionToValue(option) {
  if (!option || typeof option.value == 'undefined' || option.value === null) {
    return null;
  }
  return Map({
    value: option.value
  });
}

function enumToString(value, options) {
  const option = options.get('value')
    .find(option => option.get('value') == value.get('value'));

  if (option) {
    return option.get('label');
  }
  return '';
}

function validateEnum(value, options) {
  const option = options.get('values')
    .find(option => option.get('value') == value.get('value'));

  if (!option) {
    throw new Error(validationErrors.invalidOption);
  }
}


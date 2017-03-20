import {List, Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Select from 'react-select';

import {validationErrors} from './';

import 'react-select/dist/react-select.css';

export default function(register) {
  register('enum', {
    parseOptions(options) {
      return options
        .update('values', values => List(values)
          .map(value => typeof value == 'string' ?
            Map({value, label: value}) :
            Map(value)
          )
        );
    },

    component: EnumComponent,
    validate: validateEnum,
    toString: enumToString,
    getDefaultValue: getDefaultEnumValue
  });
}

const EnumComponent = (props) => {
  if (props.options.get('multi')) {
    return <MultiEnumComponent {...props} />;
  } else {
    return <SingleEnumComponent {...props} />;
  }
};

const MultiEnumComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <Select
    className='form-data-input select multi'
    name={name}
    value={multiValueToOptions(value)}
    disabled={disabled}
    multi={true}
    options={getSelectOptions(options)}
    onChange={options => onChange(optionsToMultiValue(options))}
    onBlur={onBlur}
  />;
};

MultiEnumComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    ImmutablePropTypes.listOf(
      React.PropTypes.string.isRequired
    ).isRequired,
    ImmutablePropTypes.listOf(
      React.PropTypes.number.isRequired
    ).isRequired
  ]).isRequired,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function multiValueToOptions(value) {
  return value ?
    value.toJS() :
    [];
}

function optionsToMultiValue(options) {
  return List(options)
    .map(optionToSingleValue)
    .filter(option => option);
}

const SingleEnumComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <Select
    className='form-data-input select single'
    name={name}
    value={singleValueToOption(value)}
    disabled={disabled}
    options={getSelectOptions(options)}
    onChange={option => onChange(optionToSingleValue(option))}
    onBlur={onBlur}
  />;
};

SingleEnumComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function singleValueToOption(value) {
  if (value === null) {
    return '';
  }
  return value;
}

function optionToSingleValue(option) {
  if (!option || typeof option.value == 'undefined' || option.value === null) {
    return null;
  }
  return option.value;
}

function getSelectOptions(options) {
  return options.get('values', List());
}

function getDefaultEnumValue(options) {
  if (options.get('multi')) {
    return List();
  } else {
    return null;
  }
}

function enumToString(value, options) {
  if (options.get('multi')) {
    const selectOptions = getSelectOptions(options)
      .filter(option => value.includes(option.get('value')));

    return selectOptions
      .map(option => option.get('label'))
      .join(', ');
  } else {
    const option = getSelectOptions(options)
      .find(option => option.get('value') == value);

    return option ?
      option.get('label') :
      '';
  }
}

function validateEnum(value, options) {
  if (options.get('multi')) {
    const selectOptions = getSelectOptions(options)
      .filter(option => value.includes(option.get('value')));

    if (value.size != selectOptions.size) {
      throw new Error(validationErrors.invalidOption);
    }
  } else {
    const option = getSelectOptions(options)
      .find(option => option.get('value') == value);

    if (!option) {
      throw new Error(validationErrors.invalidOption);
    }
  }
}


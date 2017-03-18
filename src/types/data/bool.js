import ImmutablePropTypes from 'react-immutable-proptypes';

export default function(register) {
  register('bool', {
    component: BoolComponent,
    toString: boolToString,
    getDefaultValue: getDefaultBoolValue
  });
}

const BoolComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <input
    className='form-data-input bool'
    name={name}
    type='checkbox'
    disabled={disabled}
    checked={value}
    onChange={e => onChange(valueToBool(e.target.checked))}
    onBlur={onBlur}
  />;
};

BoolComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.bool,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function valueToBool(value) {
  return value ? true : false;
}

function getDefaultBoolValue() {
  return false;
}

function boolToString(value) {
  return value ? 'Yes' : 'No';
}


import Immutable, {List, Map} from 'immutable';

import * as Types from '../';

export default function(register) {
  register('range', {
    parseOptions(options, name) {
      const rangeSubType = Types.data[options.get('rangeType')];
      if (!rangeSubType) {
        throw new Error(`Invalid range type "${options.get('rangeType')}" supplied to "${name}"`);
      }

      return options
        .set('rangeField', rangeSubType.create(`${name}.range`, options.get('rangeOptions')));
    },

    component: RangeComponent,
    getDefaultValue: getDefaultRangeValue,
    hasValue: rangeHasValue,
    toString: rangeToString,
    toConditionString: rangeToConditionString,
    useLabel: () => false
  });
}

const RangeComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  const rangeField = options.get('rangeField');
  return <div className='form-range'>
    <rangeField.Component
      value={value.get(0)}
      options={Map({placeholder: 'from'})}
      disabled={disabled}
      onChange={newValue => onChange(value.set(0, newValue))}
      onBlur={onBlur}
    />
    <div className='form-range-sep'>-</div>
    <rangeField.Component
      value={value.get(1)}
      options={Map({placeholder: 'to'})}
      disabled={disabled}
      onChange={newValue => onChange(value.set(1, newValue))}
      onBlur={onBlur}
    />
  </div>;
};

function getDefaultRangeValue(options) {
  const rangeField = options.get('rangeField');
  return List([
    rangeField.getDefaultValue(),
    rangeField.getDefaultValue()
  ]);
}

function rangeHasValue(value, options) {
  const rangeField = options.get('rangeField');
  return rangeField.hasValue(value.get(0)) || rangeField.hasValue(value.get(1));
}

function rangeToString(value, options) {
  const rangeField = options.get('rangeField');
  return `[${rangeField.toString(value.get(0))}, ${rangeField.toString(value.get(1))}]`;
}

function validateRange(value, options) {
  const rangeField = options.get('rangeField');
  rangeField.validate(value.get(0));
  rangeField.validate(value.get(1));
}

function rangeToConditionString(name, value, options) {
  const rangeField = options.get('rangeField');
  
  const valueLower = rangeField.toString(value.get(0));
  const valueUpper = rangeField.toString(value.get(1));

  if (valueLower && valueUpper) {
    return `${valueLower} < ${name} < ${valueUpper}`;
  } else if (valueLower) {
    return `${name} > ${valueLower}`;
  } else if (valueUpper) {
    return `${name} < ${valueUpper}`;
  }
}


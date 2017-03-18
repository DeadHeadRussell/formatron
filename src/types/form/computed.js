import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes, numericalDisplay, truthyDisplay} from './';

export default function(register) {
  register('computed', {
    parseOptions(options, parseField) {
      return options
        .update('left', parseField)
        .update('right', parseField);
    },

    Component: ComputedComponent,
    getValue: getComputedValue
  });
}

const ops = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
  '^': Math.pow.bind(Math),
  '>': (left, right) => left > right,
  '<': (left, right) => left < right,
  '>=': (left, right) => left >= right,
  '<=': (left, right) => left <= right,
  '=': (left, right) => left == right
};

const displays = {
  '+': numericalDisplay,
  '-': numericalDisplay,
  '*': numericalDisplay,
  '/': numericalDisplay,
  '^': numericalDisplay,
  '>': truthyDisplay,
  '<': truthyDisplay,
  '>=': truthyDisplay,
  '<=': truthyDisplay,
  '=': truthyDisplay,
  '!=': truthyDisplay
};

const ComputedComponent = ({options, getters}) => {
  return <div className='form-computed'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getComputedDisplayValue(options, getters)}
    </div>
  </div>;
};

ComputedComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    op: React.PropTypes.string.isRequired,
    left: FormPropTypes.value.isRequired,
    right: FormPropTypes.value.isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getComputedDisplayValue(options, getters) {
  const value = getComputedValue(options, getters);
  return displays[options.get('op')](value);
}

function getComputedValue(options, getters) {
  return ops[options.get('op')](
    options.get('left').getValue(getters),
    options.get('right').getValue(getters)
  );
}


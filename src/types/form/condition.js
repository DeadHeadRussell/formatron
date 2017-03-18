import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('condition', {
    parseOptions(options, parseField) {
      return options
        .update('left', parseField)
        .update('right', parseField)
        .update('trueType', parseField)
        .update('falseType', field => field && parseField(field));
    },

    Component: ConditionComponent,
    getValue: getConditionValue
  });
}

const ops = {
  '=': (left, right) => left == right,
  '!=': (left, right) => left != right,
  '>': (left, right) => left > right,
  '>=': (left, right) => left >= right,
  '<': (left, right) => left < right,
  '<=': (left, right) => left <= right,
  '&&': (left, right) => left && right,
  '||': (left, right) => left || right
};

const ConditionComponent = ({options, getters, callbacks}) => {
  const trueType = options.get('trueType');
  const falseType = options.get('falseType');

  return <div className='form-condition'>
    <Label>{options.get('label')}</Label>
    {getConditionValue(options, getters) ?
      <trueType.Component getters={getters} callbacks={callbacks} /> :
      falseType && <falseType.Component getters={getters} callbacks={callbacks} />}
  </div>;
};

ConditionComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    op: React.PropTypes.string.isRequired,
    left: FormPropTypes.value.isRequired,
    right: FormPropTypes.value.isRequired,
    trueType: FormPropTypes.display.isRequired,
    falseType: FormPropTypes.display
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getConditionValue(options, getters) {
  return ops[options.get('op')](
    options.get('left').getValue(getters),
    options.get('right').getValue(getters)
  );
}


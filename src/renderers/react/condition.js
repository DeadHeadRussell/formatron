import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes, compareAll} from './';

export default function(register) {
  register('condition', {
    parseOptions(options, parseField) {
      return options
        .update('args', args => args.map(parseField))
        .update('trueType', parseField)
        .update('falseType', field => field && parseField(field));
    },

    Component: ConditionComponent,
    getDisplayValue: getConditionDisplay,
    getValue: getConditionValue
  });
}

const ops = {
  '=': compareAll((a, b) => a == b),
  '!=': compareAll((a, b) => a != b),
  '>': compareAll((a, b) => a > b),
  '>=': compareAll((a, b) => a >= b),
  '<': compareAll((a, b) => a < b),
  '<=': compareAll((a, b) => a <= b),
  '&&': args => args.every(arg => !!arg),
  '||': args => args.some(arg => !!arg)
};

const ConditionComponent = ({options, getters, callbacks}) => {
  const trueType = options.get('trueType');
  const falseType = options.get('falseType');

  return <div className='form-condition'>
    <Label getters={getters}>{options.get('label')}</Label>
    {getConditionValue(options, getters) ?
      <trueType.Component getters={getters} callbacks={callbacks} /> :
      falseType && <falseType.Component getters={getters} callbacks={callbacks} />}
  </div>;
};

ConditionComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    op: React.PropTypes.string.isRequired,
    args: ImmutablePropTypes.listOf(
      FormPropTypes.value.isRequired
    ).isRequired,
    trueType: FormPropTypes.display.isRequired,
    falseType: FormPropTypes.display
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getConditionDisplay(options, getters) {
  const trueType = options.get('trueType');
  const falseType = options.get('falseType');

  return getConditionValue(options, getters) ?
    trueType.getDisplay(getters) :
    falseType && falseType.getDisplay(getters);
}

function getConditionValue(options, getters) {
  return ops[options.get('op')](options.get('args')
    .map(arg => arg.getValue(getters))
  );
}


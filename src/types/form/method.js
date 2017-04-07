import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('method', {
    parseOptions(options, parseField) {
      return options
        .update('obj', parseField)
        .update('args', args => args.map(parseField));
    },

    Component: MethodComponent,
    getValue: getMethodValue
  });
}

const MethodComponent = ({options, getters}) => {
  return <div className='form-method'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getMethodValue(options, getters)}
    </div>
  </div>;
};

MethodComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    obj: FormPropTypes.value.isRequired,
    method: React.PropTypes.string.isRequired,
    args: ImmutablePropTypes.listOf(
      FormPropTypes.value.isRequired
    )
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getMethodValue(options, getters) {
  const objValue = options.get('obj').getValue(getters);
  if (!objValue) {
    return null;
  }

  const args = options.get('args', List()).toArray();
  const argValues = args.map(arg => arg.getValue(getters));
  return objValue[options.get('method')](...argValues);
}


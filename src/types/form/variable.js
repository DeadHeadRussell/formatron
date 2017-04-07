import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('variable', {
    Component: VariableComponent,
    getValue: getVariableValue
  });
}

const variables = {
  now: () => Date.now() / 1000
};

const display = {
  now: () => (new Date()).toLocaleString()
};

const VariableComponent = ({options}) => {
  return <div className='form-variable'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>{display[options.get('name')]()}</div>
  </div>;
};

VariableComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    name: React.PropTypes.string.isRequired
  }).isRequired
};

function getVariableValue(options) {
  return variables[options.get('name')]();
}


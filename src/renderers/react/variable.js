import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('variable', {
    Component: VariableComponent,
    getDisplayValue: getVariableDisplayValue,
    getValue: getVariableValue
  });
}

const variables = {
  now: () => Date.now() / 1000
};

const display = {
  now: () => (new Date()).toLocaleString()
};

const VariableComponent = ({options, getters}) => {
  return <div className='form-variable'>
    <Label getters={getters}>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getVariableDisplayValue(options)}
    </div>
  </div>;
};

VariableComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    name: React.PropTypes.string.isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getVariableDisplayValue(options) {
  return display[options.get('name')]();
}

function getVariableValue(options) {
  return variables[options.get('name')]();
}


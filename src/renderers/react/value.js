import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('value', {
    Component: ValueComponent,
    getDisplayValue: getValueValue,
    getValue: getValueValue
  });
}

const ValueComponent = ({options, getters}) => {
  const value = options.get('value');
  return <div className='form-value'>
    <Label getters={getters}>{options.get('label')}</Label>
    {value !== null ? (
      <div className='form-data-input-wrapper'>{options.get('value')}</div>
    ) : null}
  </div>;
};

ValueComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    value: React.PropTypes.any.isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getValueValue(options) {
  return options.get('value');
}

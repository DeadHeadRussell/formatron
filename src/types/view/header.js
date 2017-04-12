import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('header', {
    Component: HeaderComponent
  });
}

const HeaderComponent = ({options, getters}) => {
  return <div className='form-header'>
    <Label getters={getters}>{options.get('label')}</Label>
  </div>;
};

HeaderComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string.isRequired,
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
};


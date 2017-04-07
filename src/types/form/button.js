import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';

export default function(register) {
  register('button', {
    Component: ButtonComponent
  });
}

const ButtonComponent = ({options, callbacks}) => {
  const args = options.get('args', List()).toArray();

  return <button
    className='form-button'
    type='button'
    onClick={() => callbacks.onButtonClick(...args)}
  >
    <Label>{options.get('label')}</Label>
  </button>;
};

ButtonComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    args: ImmutablePropTypes.list
  }),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};


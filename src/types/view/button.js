import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';

export default function(register) {
  register('button', {
    Component: ButtonComponent
  });
}

const ButtonComponent = ({options, getters, callbacks}) => {
  const args = options.get('args', List()).toArray();

  return <button
    className='form-button'
    type='button'
    onClick={() => callbacks.onButtonClick(...args)}
  >
    <Label getters={getters}>{options.get('label')}</Label>
  </button>;
};

ButtonComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    args: ImmutablePropTypes.list
  }),
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};


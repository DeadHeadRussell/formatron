import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';

export default function(register) {
  register('button', {
    Component: ButtonComponent,
    getDisplayValue: getButtonDisplay,
    getTableSizing: getButtonSizing
  });
}

const ButtonComponent = ({options, getters, callbacks}) => {
  const args = options.get('args', List()).toArray();

  const label = typeof options.get('label') == 'string' ?
    options.get('label') :
    options.get('label')(getters.getModel());

  return <button
    className='form-button'
    type='button'
    onClick={() => callbacks.onButtonClick(...args)}
  >
    <Label getters={getters}>{label}</Label>
  </button>;
};

ButtonComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    args: ImmutablePropTypes.list
  }),
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getButtonDisplay(options, getters) {
  return callbacks => <ButtonComponent
    options={options}
    getters={getters}
    callbacks={callbacks}
  />;
}

function getButtonSizing(options) {
  if (options.get('width')) {
    return {
      width: options.get('width'),
      grow: 0,
      shrink: 0
    };
  }
  return undefined;
}


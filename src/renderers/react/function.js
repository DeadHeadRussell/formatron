import {List} from 'immutable';
import moment from 'moment';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes, numericalDisplay, textDisplay} from './';

export default function(register) {
  register('function', {
    parseOptions(options, parseField) {
      return options
        .update('args', args => args.map(parseField));
    },

    Component: FunctionComponent,
    getValue: getFunctionValue,
    getDisplayValue: getFunctionValue
  });
}

const fns = {
  ceil: value => Math.ceil(value),
  floor: value => Math.floor(value),
  round: value => Math.round(value),
  formatDate: (value, format) => moment(value * 1000).format(format)
};

const displays = {
  ceil: numericalDisplay,
  floor: numericalDisplay,
  round: numericalDisplay,
  formatDate: textDisplay
};

const FunctionComponent = ({options, getters}) => {
  return <div className='form-function'>
    <Label getters={getters}>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getFunctionValue(options, getters)}
    </div>
  </div>;
};

FunctionComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    fn: React.PropTypes.string.isRequired,
    args: ImmutablePropTypes.listOf(
      FormPropTypes.value.isRequired
    )
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getFunctionValue(options, getters) {
  const args = options.get('args', List()).toArray();
  return fns[options.get('fn')](...args
    .map(arg => arg.getValue(getters))
  );
}


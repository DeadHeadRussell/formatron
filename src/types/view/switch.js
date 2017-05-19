import {List} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes, compareAll} from './';

export default function(register) {
  register('switch', {
    parseOptions(options, parseField) {
      return options
        .update('switch', parseField)
        .update('cases', cases => cases.map(caseObj => caseObj
          .update('case', parseField)
          .update('display', parseField)
        ))
        .update('defaultCase', field => field && parseField(field));
    },

    Component: SwitchComponent,
    getValue: getSwitchValue
  });
}

const SwitchComponent = ({options, getters, callbacks}) => {
  const display = getSwitchCase(options, getters);

  return <div className='form-switch'>
    <Label getters={getters}>{options.get('label')}</Label>
    {display ?
      <display.Component getters={getters} callbacks={callbacks} /> :
      null}
  </div>;
};

SwitchComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    switch: FormPropTypes.value.isRequired,
    cases: ImmutablePropTypes.listOf(
      ImmutablePropTypes.contains({
        case: FormPropTypes.value.isRequired,
        display: FormPropTypes.display.isRequired
      }).isRequired
    ).isRequired,
    defaultCase: FormPropTypes.display
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getSwitchCase(options, getters) {
  const switchValue = options.get('switch').getValue(getters);
  const caseObj = options.get('cases')
    .find(caseObj => caseObj.get('case').getValue(getters) == switchValue);

  if (caseObj) {
    return caseObj.get('display');
  }

  if (options.get('defaultCase')) {
    return options.get('defaultCase');
  }

  return null;
}

function getSwitchValue(options, getters) {
  const switchCase = getSwitchCase(options, getters);
  if (switchCase) {
    return switchCase.getValue(getters);
  }
  return null;
}


import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('row', {
    parseOptions(options, parseField) {
      return options
        .update('properties', props => props.map(parseField));
    },
    Component: RowComponent,
    getDisplayValue: getRowDisplay
  });
}

const RowComponent = ({options, getters, callbacks}) => {
  return <div className='form-row'>
    <Label getters={getters}>{options.get('label')}</Label>
    <div className='form-row-wrapper'>
      {options.get('properties').map((field, i) =>
        <field.Component key={i} getters={getters} callbacks={callbacks} />
      )}
    </div>
  </div>;
};

RowComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    properties: ImmutablePropTypes.listOf(
      FormPropTypes.display.isRequired
    ).isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getRowDisplay(options, getters) {
  return callbacks => <RowComponent
    options={options}
    getters={getters}
    callbacks={callbacks}
  />;
}


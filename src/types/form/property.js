import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('property', {
    parseOptions(options, parseField) {
      return options
        .update('obj', parseField);
    },

    Component: PropertyComponent,
    getValue: getPropertyValue
  });
}

const PropertyComponent = ({options, getters}) => {
  return <div className='form-property'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {getPropertyValue(options, getters)}
    </div>
  </div>;
};

PropertyComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    obj: FormPropTypes.value.isRequired,
    property: React.PropTypes.string.isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getPropertyValue(options, getters) {
  const objValue = options.get('obj').getValue(getters);
  return objValue ?
    objValue[options.get('property')] :
    null;
}


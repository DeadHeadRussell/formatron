import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('value', {
    Component: ValueComponent,
    getValue: getValueValue
  });
}

const ValueComponent = ({options}) => {
  return <div className='form-value'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>{options.get('value')}</div>
  </div>;
};

ValueComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    value: React.PropTypes.any.isRequired
  }).isRequired
};

function getValueValue(options) {
  return options.get('value');
}


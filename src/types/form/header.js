import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import {FormPropTypes} from './';

export default function(register) {
  register('header', {
    Component: HeaderComponent
  });
}

const HeaderComponent = ({options}) => {
  return <div className='form-header'>
    <Label>{options.get('label')}</Label>
  </div>;
};

HeaderComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string.isRequired,
  }).isRequired
};


import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import parseTemplate from '~/template';
import {FormPropTypes} from './';

export default function(register) {
  register('template', {
    Component: TemplateComponent,
    getValue: getTemplateValue
  });
}

const TemplateComponent = ({options, getters}) => {
  const value = getTemplateValue(options, getters);

  return <div className='form-template'>
    <Label>{options.get('label')}</Label>
    <div className='form-data-input-wrapper'>
      {value}
    </div>
  </div>;
};

TemplateComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    template: React.PropTypes.string.isRequired
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};

function getTemplateValue(options, getters) {
  return parseTemplate(options.get('template'), getters.getDataLabel);
}


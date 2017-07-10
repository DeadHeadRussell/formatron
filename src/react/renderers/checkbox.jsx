import CheckboxType from '~/types/view/data/checkbox';

import {withDataRenderer, withStaticRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableDropDownFilter} from './tableHelpers';

const CheckboxFilter = ({renderData}) => (
  <TableDropDownFilter
    renderData={renderData}
    multi={false}
    options={[{
      value: 1,
      label: 'Yes'
    }, {
      value: 0,
      label: 'No'
    }]}
  />
);

const Checkbox = withDataRenderer(({value, disabled, onChange, onBlur}) => (
  <input
    className='formatron-input formatron-checkbox'
    type='checkbox'
    disabled={disabled}
    checked={!!value}
    onChange={e => onChange(!!e.target.checked)}
    onBlur={() => onBlur()}
  />
));

const StaticCheckbox = withStaticRenderer(({value}) => (
  <input
    className='formatron-input formatron-checkbox'
    type='checkbox'
    checked={!!value}
    readOnly={true}
  />
));

const CheckboxField = withFormLabel(Checkbox);
const StaticCheckboxField = withStaticLabel(StaticCheckbox);

export default ReactRenderer.register(
  CheckboxType,
  CheckboxField,
  StaticCheckboxField,
  CheckboxFilter,
  Checkbox,
  StaticCheckbox
);


import NumberType from '~/types/data/number';
import PercentType from '~/types/view/data/percent';

import {withDataRenderer, withDisplayRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import FormatronPropTypes from '~/react/propTypes';
import ReactRenderer from './reactRenderer';
import {TableRangeFilter} from './tableHelpers';

const PercentInput = ({field, value, disabled, placeholder, onChange, onBlur}) => (
  <input
    className='formatron-number-input formatron-percent'
    type='text'
    disabled={disabled}
    value={numberToInput(value)}
    placeholder={placeholder}
    onChange={e => onChange(inputToNumber(e.target.value))}
    onBlur={onBlur}
  />
);

PercentInput.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(NumberType).isRequired,
  value: React.PropTypes.number,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.text,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function numberToInput(number) {
  if (!Number.isFinite(number)) {
    return '';
  }
  return `${number}`;
}

function inputToNumber(input) {
  if (typeof input != 'string' || input.length == 0) {
    return null;
  }
  const number = Number(input);
  if (Number.isFinite(number)) {
    return number;
  }
  return null;
}

const PercentField = withFormLabel(Percent);
const StaticPercentField = withStaticLabel(StaticPercent);

const PercentFilter = ({renderData}) => (
  <TableRangeFilter
    viewType={viewType}
    renderData={renderData}
    Component={PercentInput}
  />
);

const Percent = withDataRenderer(props => (
  <PercentInput {...props} />
));

const StaticPercent = withDisplayRenderer(({value}) => (
  <p className='formatron-static-value'>{value}</p>
));

export default ReactRenderer.register(
  PercentType,
  PercentField,
  StaticPercentField,
  PercentFilter,
  Percent,
  StaticPercent
);


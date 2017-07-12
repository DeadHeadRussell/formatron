import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Select from '~/react/components/tetheredSelect';
import EnumType from '~/types/data/enum';
import DropDownType from '~/types/view/data/dropDown';

import {withDataRenderer, withStaticRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import FormatronPropTypes from '~/react/propTypes';
import ReactRenderer from './reactRenderer';
import {TableDropDownFilter} from './tableHelpers';

const DropDownFilter = ({viewType, renderData}) => (
  <TableDropDownFilter
    renderData={renderData}
    options={viewType.getOptions(renderData.dataType).toJS()}
  />
);

const MultiDropDown = ({viewType, field, value, disabled, onChange, onBlur}) => {
  return <Select
    className='formatron-input formatron-dropdown formatron-multi'
    value={value ? value.toJS() : []}
    disabled={disabled}
    multi={true}
    options={viewType.getOptions(field).toJS()}
    onChange={options => onChange(List(options)
      .map(parseOption)
      .filter(option => option)
    )}
    onBlur={onBlur}
  />;
};

MultiDropDown.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(EnumType).isRequired,
  value: React.PropTypes.oneOfType([
    ImmutablePropTypes.listOf(
      React.PropTypes.string.isRequired
    ).isRequired,
    ImmutablePropTypes.listOf(
      React.PropTypes.number.isRequired
    ).isRequired
  ]).isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

const SingleDropDown = ({viewType, field, value, disabled, onChange, onBlur}) => {
  return <Select
    className='formatron-input formatron-dropdown formatron-single'
    value={value === null ? '' : value}
    disabled={disabled}
    options={viewType.getOptions(field).toJS()}
    onChange={option => onChange(parseOption(option))}
    onBlur={onBlur}
  />;
};

SingleDropDown.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(EnumType).isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function parseOption(option) {
  if (!option || typeof option.value == 'undefined') {
    return null;
  }
  return option.value;
}

const DropDown = withDataRenderer(props => (
  props.viewType.isMulti() ? (
    <MultiDropDown {...props} />
  ) : (
    <SingleDropDown {...props} />
  )
));

const StaticDropDown = withStaticRenderer(({field, value}) => (
  <p className='formatron-static-value'>
    {field.getDisplay(value)}
  </p>
));

const DropDownField = withFormLabel(DropDown);
const StaticDropDownField = withStaticLabel(StaticDropDown);

export default ReactRenderer.register(
  DropDownType,
  DropDownField,
  StaticDropDownField,
  DropDownFilter,
  DropDown,
  StaticDropDown
);


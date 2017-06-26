import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Renderer from '../renderer';

export class CheckboxRenderer extends Renderer {
  renderFormField(viewType, renderData) {
    const dataType = renderData.dataType;
    const dataValue = renderData.dataValue;
    const {disabled, error, onChange, onBlur} = renderData.options;

    return (
      <label className='form-data bool'>
        <Label>{viewType.options.get('label')}</Label>
        <div
          className={classNames('form-data-input-wrapper', {disabled})}
          data-error={error}
        >
          <input
            className='form-data-input bool'
            name={dataType.name}
            type='checkbox'
            disabled={disabled}
            checked={dataValue}
            onChange={e => onChange(!!e.target.checked)}
            onBlur={() => onBlur()}
          />
        </div>
      </label>
    );
  }

  renderStaticField(viewType, renderData) {
  }

  renderTableHeader(viewType, renderData) {
  }

  renderTableFilter(viewType, renderData) {
  }

  renderTableCell(viewType, renderData) {
  }

  renderStaticTableCell(viewType, renderData) {
  }
}

export default function(register) {
  register('bool', {
    component: BoolComponent,
    toString: boolToString,
    getDefaultValue: getDefaultBoolValue
  });
}

const BoolComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <input
    className='form-data-input bool'
    name={name}
    type='checkbox'
    disabled={disabled}
    checked={value}
    onChange={e => onChange(valueToBool(e.target.checked))}
    onBlur={onBlur}
  />;
};

BoolComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.bool,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function valueToBool(value) {
  return value ? true : false;
}

function getDefaultBoolValue() {
  return false;
}

function boolToString(value) {
  return value ? 'Yes' : 'No';
}


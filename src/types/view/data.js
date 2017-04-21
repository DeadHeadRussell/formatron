import classNames from 'classnames';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import parseTemplate from '~/template';

export default function(register) {
  register('data', {
    parseOptions(options, parseField) {
      return options
        .update('defaultValue', field => field && parseField(field));
    },

    Component: DataComponent,
    getValue: getDataValue,
    getDisplayValue: getDataDisplayValue
  });
}

const DataComponent = ({options, getters, callbacks}) => {
  if (!options.get('editable', true)) {
    return <div className='form-data static'>
      <Label getters={getters}>{options.get('label')}</Label>
      <div className='form-data-input-wrapper'>
        {getDataDisplayValue(options, getters)}
      </div>
    </div>;
  }

  const {field, value} = getters.getDataFieldAndValue(options.get('ref'));
  const classes = classNames('form-data', field.type.name);

  const children = [
    <Label key='label' getters={getters} required={field.options.get('required')}>{options.get('label')}</Label>,
    <div
      key='display'
      className='form-data-input-wrapper'
      data-error={getters.getError(options.get('ref'))}
    >
      <field.Component
        schemaName={getters.getName()}
        value={value}
        disabled={!!getters.getDisabled(options.get('ref'))}
        onChange={newValue => callbacks.onChange(options.get('ref'), newValue)}
        onBlur={() => callbacks.onBlur(options.get('ref'))}
        parseTemplate={(template, options) => parseTemplate(template, getters.getDataLabel, options)}
      />
    </div>
  ];

  if (options.get('useLabel', true) && field.useLabel()) {
    return <label className={classes}>{children}</label>;
  } else {
    return <div className={classes}>{children}</div>;
  }
};

const refValueType = React.PropTypes.oneOfType([
  React.PropTypes.string.isRequired,
  React.PropTypes.number.isRequired
]);

const refType = React.PropTypes.oneOfType([
  refValueType.isRequired,
  ImmutablePropTypes.listOf(
    refValueType.isRequired
  ).isRequired
]);

DataComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    ref: refType.isRequired,
    editable: React.PropTypes.bool,
    useLabel: React.PropTypes.bool
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getDataDisplayValue(options, getters) {
  const label = getters.getDataLabel(options.get('ref'));
  if (!label && options.get('defaultValue')) {
    return options.get('defaultValue').getDisplay(getters);
  }
  return label;
}

function getDataValue(options, getters) {
  const {field, value} = getters.getDataFieldAndValue(options.get('ref'));
  if (!field.hasValue(value) && options.get('defaultValue')) {
    return options.get('defaultValue').getValue(getters);
  }
  return value;
}


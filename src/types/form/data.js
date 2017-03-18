import classNames from 'classnames';
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
    getValue: getDataValue
  });
}

const DataComponent = ({options, getters, callbacks}) => {
  const {field, value} = getters.getDataFieldAndValue(options.get('ref'));

  if (!field) {
    throw new Error(`Invalid ref in data form field: ref = ${options.get('ref')}, label = ${options.get('label')}`);
  }

  if (!options.get('editable', true)) {
    return <div className='form-data static'>
      <Label>{options.get('label')}</Label>
      <div className='form-data-input-wrapper'>
        {field.toString(value)}
      </div>
    </div>;
  }

  const classes = classNames('form-data', field.type);

  const children = [
    <Label key='label' required={field.options.get('required')}>{options.get('label')}</Label>,
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

DataComponent.propTypes = {
  options: ImmutablePropTypes.contains({
    label: React.PropTypes.string,
    ref: React.PropTypes.oneOfType([
      React.PropTypes.string.isRequired,
      ImmutablePropTypes.listOf(
        React.PropTypes.string.isRequired
      ).isRequired
    ]).isRequired,
    editable: React.PropTypes.bool,
    useLabel: React.PropTypes.bool
  }).isRequired,
  getters: React.PropTypes.objectOf(React.PropTypes.func),
  callbacks: React.PropTypes.objectOf(React.PropTypes.func)
};

function getDataValue(options, getters) {
  const {field, value} = getters.getDataFieldAndValue(options.get('ref'));
  if (!field.hasValue(value) && options.get('defaultValue')) {
    return options.get('defaultValue').getValue(getters);
  }
  return value;
}


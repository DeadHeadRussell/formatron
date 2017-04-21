import moment from 'moment';
import React from 'react';
import {Calendar, TransitionView} from 'react-date-picker';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DateField from '~/components/tetheredDateField';

export default function(register) {
  register('date', {
    component: DateComponent,
    toString: dateToString
  });
}

const DateComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <DateField
    className='form-data-input date'
    value={formatDateValue(value)}
    placeholder={options.get('placeholder')}
    dateFormat={getDateFormat(options.get('dateType'))}
    disabled={disabled}
    updateOnDateClick={true}
    onChange={e => onChange(valueToDate(e))}
    onBlur={onBlur}
  >
    <TransitionView cancelButton={false} clearButton={false}>
      <Calendar />
    </TransitionView>
  </DateField>;
};

DateComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.number,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function formatDateValue(value) {
  return value ?
    new Date(value * 1000) :
    '';
}

function getDateFormat(dateType) {
  switch (dateType) {
    case 'time':
      return 'hh:mm a';
    case 'datetime':
      return 'YYYY-MM-DD hh:mm a';
    case 'date':
    default:
      return 'YYYY-MM-DD';
  }
}

function valueToDate(value) {
  const dateValue = moment(value).valueOf() / 1000;
  if (Number.isFinite(dateValue)) {
    return dateValue;
  }
  return null;
}

function dateToString(value, options) {
  if (!Number.isFinite(value)) {
    return '';
  }

  const formatString = getDateFormat(options.get('dateType'));
  return moment(value * 1000).format(formatString);
}


import moment from 'moment';
import React from 'react';
import DatetimePicker from 'yet-another-datetime-picker';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TetheredComponent from 'react-tether';

export default function(register) {
  register('date', {
    component: DateComponent,
    toString: (value, options) => {
      return datetimeToString(value, options.get('dateType'));
    }
  });
}

class DateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blurTimeout = 0;
    this.state = createInitialState(props);
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...this.state,
      input: createInitialState(props).input
    });
  }

  render() {
    const {options, disabled} = this.props;
    return (
      <div
        className='form-data-input-date-wrapper'
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <input
          className='form-data-input date'
          type='text'
          value={this.state.input}
          onChange={this.handleInputChange}
          placeholder={options.get('placeholder')}
          disabled={disabled}
        />
        {this.state.showPicker && !disabled ? this.renderPicker() : null}
      </div>
    );
  }

  renderPicker() {
    const {options, value} = this.props;
    let datetime = unixToDatetime(value);
    if (!datetime.isValid()) datetime = moment();
    return (
      <TetheredComponent
        classes={{element: 'tether-element-top'}}
        renderElementTo='body'
        attachment='top left'
      >
        <div className='tether-target' />
        <DatetimePicker
          className='form-data-datetime-picker'
          onFocusCapture={this.handleFocus}
          onBlur={this.handleBlur}
          moment={datetime}
          onChange={this.handlePickerChange}
          onDone={this.handleBlur}
          type={options.get('dateType')}
          prevMonthIcon='fa fa-angle-left'
          nextMonthIcon='fa fa-angle-right'
          doneIcon='fa fa-check'
          dateIcon='fa fa-calendar'
          timeIcon='fa fa-clock-o'
        />
      </TetheredComponent>
    )
  }

  handleFocus = () => {
    clearTimeout(this.blurTimeout);
    this.setState({showPicker: true});
  }

  handleBlur = () => {
    // Wait for possible focus event before handling the blur event.
    this.blurTimeout = setTimeout(() => {
      this.setState({showPicker: false}, () => {
        this.saveInput();
        this.props.onBlur();
      });
    });
  }

  saveInput = () => {
    let unixTimestamp = null;
    if (this.state.input) {
      let datetime = stringToDatetime(this.state.input);
      if (datetime.isValid()) {
        unixTimestamp = datetimeToUnix(datetime);
      }
    }
    if (unixTimestamp !== this.props.value) {
      this.props.onChange(unixTimestamp);
    }
  }

  handlePickerChange = (datetime) => {
    const unixTimestamp = datetimeToUnix(datetime);
    this.props.onChange(unixTimestamp);
  }

  handleInputChange = (event) => {
    this.setState({
      ...this.state,
      input: event.target.value
    });
  }
}

function createInitialState(props) {
  let input = '';
  let datetime = unixToDatetime(props.value);
  if (datetime.isValid()) {
    const type = props.options.get('dateType');
    input = datetimeToString(datetime, type);
  }
  return {
    showPicker: false,
    input
  };
}

function unixToDatetime(unixTime) {
  if (unixTime === undefined || unixTime === null) {
    // Return an invalid moment object, meaning no date is selected.
    return moment(null);
  } else {
    return moment(unixTime * 1000);
  }
}

function datetimeToUnix(datetime) {
  return datetime.valueOf() / 1000;
}

function stringToDatetime(str, type) {
  if (type === 'time' && isNaN(str)) {
    // Time strings (e.g. '12:30 pm') can't be parsed w/o specifying a format.
    return moment(str, getDateFormat(type));
  } else {
    return moment(str);
  }
}

function datetimeToString(datetime, type) {
  return datetime.format(getDateFormat(type));
}

function getDateFormat(type) {
  switch (type) {
    case 'time':
      return 'hh:mm a';
    case 'date':
      return 'YYYY-MM-DD';
    case 'datetime':
    default:
      return 'YYYY-MM-DD hh:mm a';
  }
}

DateComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.number,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

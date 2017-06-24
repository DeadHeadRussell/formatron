import DatetimePicker from 'yet-another-datetime-picker';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import TetheredComponent from 'react-tether';
import debounce from 'debounce';
import moment from 'moment';

const SECS_IN_DAY = 24 * 60 * 60;
const MS_IN_DAY = SECS_IN_DAY * 1000;

export default function(register) {
  register('date', {
    component: DateComponent,
    toString: (value, options) => {
      return unixToString(value, options.get('dateType'));
    }
  });
}

const propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.number,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

class DateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.blurTimeout = 0;
    this.state = this.createInitialState(props);
  }

  // Debounce greatly improves time picker slider performance.
  componentWillReceiveProps = debounce((props) => {
    this.setState({input: this.createInitialState(props).input});
  }, 15);

  handleFocus = () => {
    clearTimeout(this.blurTimeout);
    this.setState({showPicker: true});
  }

  handleBlur = () => {
    // Wait for possible focus event before handling the blur event.
    this.blurTimeout = setTimeout(() => {
      this.saveInput();
      this.setState({showPicker: false});
      this.props.onBlur();
    });
  }

  saveInput = () => {
    const unixTimestamp = this.getInputUnixTime();
    this.props.onChange(unixTimestamp);
  }

  handlePickerChange = (datetime) => {
    const type = this.props.options.get('dateType');
    const unixTimestamp = datetimeToUnix(datetime, type);
    this.setState({input: this.getInputFromDatetime(datetime)});
    //this.props.onChange(unixTimestamp);
  }

  handleInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  handleClearInput = () => {
    clearTimeout(this.blurTimeout);
    this.setState({input: null});
    this.handleBlur();
  }

  handleEnter = (event) => {
    if (event.which == 13) {
      event.preventDefault();
      event.stopPropagation();
      this.handleBlur();
    }
  }

  createInitialState(props) {
    const type = props.options.get('dateType');
    const datetime = unixToDatetime(props.value, type);
    return {
      showPicker: false,
      input: this.getInputFromDatetime(datetime)
    };
  }

  getInputFromDatetime(datetime) {
    if (datetime.isValid()) {
      const type = this.props.options.get('dateType');
      return datetimeToString(datetime, type);
    }
    return '';
  }

  getInputUnixTime() {
    if (!this.state.input) return null;
    const type = this.props.options.get('dateType');
    const datetime = stringToDatetime(this.state.input, type);
    if (datetime.isValid()) {
      return datetimeToUnix(datetime, type);
    }
    return null;
  }

  getInputDatetime() {
    if (!this.state.input) return moment();
    const type = this.props.options.get('dateType');
    return stringToDatetime(this.state.input, type);
  }

  getPickerDatetime() {
    return this.getInputDatetime();

    const type = this.props.options.get('dateType');
    const value = this.props.value;
    if (value !== null) return unixToDatetime(value, type);
    return moment();
  }

  renderPicker() {
    const {options} = this.props;
    return (
      <TetheredComponent
        classes={{
          element: 'tether-element-top'
        }}
        renderElementTo='body'
        attachment='top left'
        targetAttachment='bottom left'
        constraints={[{
          to: 'scrollParent',
          attachment: 'together'
        }, {
          to: 'window',
          attachment: 'together'
        }]}
      >
        <div className='tether-target' />
        <DatetimePicker
          className='form-data-datetime-picker'
          onFocusCapture={this.handleFocus}
          onBlur={this.handleBlur}
          moment={this.getPickerDatetime()}
          onChange={this.handlePickerChange}
          onDone={this.handleBlur}
          onKeyPress={this.handleEnter}
          type={options.get('dateType')}
          prevMonthIcon='fa fa-angle-left'
          nextMonthIcon='fa fa-angle-right'
          doneIcon='fa fa-check'
          dateIcon='fa fa-calendar'
          timeIcon='fa fa-clock-o'
        />
      </TetheredComponent>
    );
  }

  render() {
    const {options, disabled} = this.props;
    return (
      <div className='form-data-input-date-wrapper'>
        <input
          className='form-data-input date'
          type='text'
          value={this.state.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleInputChange}
          onKeyPress={this.handleEnter}
          placeholder={options.get('placeholder')}
          disabled={disabled}
        />
        {this.state.input ? (
          <button className='form-data-datetime-clear' onClick={this.handleClearInput}>
            <span>{"\u00D7"}</span>
          </button>
        ) : null}
        {this.state.showPicker && !disabled ? this.renderPicker() : null}
      </div>
    );
  }
}

DateComponent.propTypes = propTypes;

function unixToDatetime(unixTime, type) {
  if (unixTime === null) return moment(null);
  if (type === 'time') {
    return moment.utc(unixTime * 1000);
  }
  return moment(unixTime * 1000);
}

function datetimeToUnix(datetime, type) {
  const unix = datetime.valueOf() / 1000;
  if (type === 'time') {
    return datetime.hours() * 3600 + datetime.minutes() * 60 + datetime.seconds();
  }
  return unix;
}

function stringToDatetime(str, type) {
  if (type === 'time' && isNaN(str)) {
    const today = moment.utc(str, getDateFormat(type));
    const unixTime = datetimeToUnix(today, type);
    return unixToDatetime(unixTime, type);
  } else {
    return moment(str);
  }
}

function datetimeToString(datetime, type) {
  if (datetime.isValid()) {
    return datetime.format(getDateFormat(type));
  } else {
    return '';
  }
}

function unixToString(unixTime, type) {
  return datetimeToString(unixToDatetime(unixTime, type), type);
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


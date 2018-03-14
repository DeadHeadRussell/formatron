import debounce from 'debounce';
import moment from 'moment';
import TetheredComponent from 'react-tether';
import DatetimePicker from 'yet-another-datetime-picker';

import {convertDate} from '~/utils';

export default class CalendarInput extends React.Component {
  /**
   * The format prop must be a valid format according to the type prop. Eg,
   * a type of "date" should specify years, months and days in some order.
   * "time" should specify hours, minutes, and am/pm.  "datetime" should
   * specify all of the above.  See "moment.js" docs for more details on the
   * formats allowed.
   */
  static propTypes = {
    type: React.PropTypes.oneOf(['date', 'time', 'datetime']).isRequired,
    format: React.PropTypes.string.isRequired,
    value: React.PropTypes.any,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.blurTimeout = 0;
    this.state = this.createInitialState(props);
  }

  // Debounce greatly improves time picker slider performance.
  componentWillReceiveProps = debounce(props => {
    this.setState({input: this.createInitialState(props).input});
  }, 15);

  handleFocus = () => {
    clearTimeout(this.blurTimeout);
    this.setState({showPicker: true});
  };

  handleClick = () => {
    this.calendarInput.focus();
  }

  handleBlur = (setDefault) => {
    // Wait for possible focus event before handling the blur event.
    this.blurTimeout = setTimeout(() => {
      const {type, format} = this.props;
      if (setDefault && this.state.input === '') {
        this.setState({input: convertDate(moment(), 'string', {type, format})})
      }
      this.saveInput();
      this.setState({showPicker: false});
      this.props.onBlur();
    });
  };

  saveInput = () => {
    const {type, format} = this.props;
    this.props.onChange(convertDate(this.state.input, 'unix', {type, format}));
  };

  handlePickerChange = datetime => {
    const {type, format} = this.props;
    this.setState({input: convertDate(datetime, 'string', {type, format})});
  };

  handleInputChange = event => {
    this.setState({input: event.target.value});
  };

  handleClearInput = e => {
    e.stopPropagation();
    e.preventDefault();
    clearTimeout(this.blurTimeout);
    this.setState({input: ''}, this.handleBlur.bind(this, false));
  };

  handleEnter = event => {
    if (event.which == 13) {
      event.preventDefault();
      event.stopPropagation();
      this.handleBlur(true);
    }
  };

  createInitialState(props) {
    const {value, type, format} = props;
    return {
      showPicker: false,
      input: convertDate(value, 'string', {type, format}),
    };
  }

  getPickerDatetime() {
    const {type, format} = this.props;
    if (!this.state.input) {
      return moment();
    }
    return convertDate(this.state.input, 'datetime', {type, format});
  }

  renderPicker() {
    return (
      <TetheredComponent
        classes={{
          element: 'formatron-tether-element-top',
        }}
        renderElementTo="body"
        attachment="top left"
        targetAttachment="bottom left"
        constraints={[
          {
            to: 'scrollParent',
            attachment: 'together',
          },
          {
            to: 'window',
            attachment: 'together',
          },
        ]}
      >
        <div className="formatron-tether-target" />
        <DatetimePicker
          className="formatron-datetime-picker"
          onFocusCapture={this.handleFocus}
          onBlur={this.handleBlur.bind(this, false)}
          moment={this.getPickerDatetime()}
          onChange={this.handlePickerChange}
          onDone={this.handleBlur.bind(this, true)}
          onKeyPress={this.handleEnter}
          type={this.props.type}

          nextMonthIcon='fa fa-angle-right'
          prevMonthIcon='fa fa-angle-left'
          doneIcon='fa fa-check'
          dateIcon='fa fa-calendar'
          timeIcon='fa fa-clock-o'
          theme={{
            colorPrimary: '#606060',
            iconPrevMonth: 'fa fa-angle-left',
            iconNextMonth: 'fa fa-angle-right',
            iconDone: 'fa fa-check',
            iconDate: 'fa fa-calendar',
            iconTime: 'fa fa-clock-o',
          }}
        />
      </TetheredComponent>
    );
  }

  render() {
    const {disabled, placeholder} = this.props;
    return (
      <div onClick={this.handleClick} className="formatron-input formatron-calendar">
        <input
          ref={el => this.calendarInput = el}
          className="formatron-input-inner"
          type="text"
          value={this.state.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur.bind(this, false)}
          onChange={this.handleInputChange}
          onKeyPress={this.handleEnter}
          placeholder={placeholder}
          disabled={disabled}
        />
        {!disabled && this.state.input
          ? <button
              className="formatron-field-action"
              onClick={this.handleClearInput}
            >
              <span>
                {'\u00D7'}
              </span>
            </button>
          : null}
        {this.state.showPicker && !disabled ? this.renderPicker() : null}
      </div>
    );
  }
}


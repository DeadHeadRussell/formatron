import debounce from 'debounce';
import moment from 'moment';
import TetheredComponent from 'react-tether';
import DatetimePicker from 'yet-another-datetime-picker';

import Form from '~/react/components/form';
import FormatronPropTypes from '~/react/propTypes';
import * as Types from '~/types';
import DateType from '~/types/data/date';
import CalendarType from '~/types/view/data/calendar';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {withDataRenderer, withDisplayRenderer} from './';

class CalendarFilter extends React.Component {
  static filterData = new Types.data.map('filter', {
    data: [
      new Types.data.enum('filterType', {
        values: [
          {value: 'Today', label: 'Today'},
          {value: 'Yesterday', label: 'Yesterday'},
          {value: 'Last 7 Days', label: 'Last 7 Days'},
          {value: 'Last 30 Days', label: 'Last 30 Days'},
          {value: 'Last 365 Days', label: 'Last 365 Days'},
          {value: 'This Week', label: 'This Week'},
          {value: 'Last Week', label: 'Last Week'},
          {value: 'This Month', label: 'This Month'},
          {value: 'Last Month', label: 'Last Month'},
          {value: 'This Year', label: 'This Year'},
          {value: 'Last Year', label: 'Last Year'},
          {value: 'Custom Dates - Start, End', label: 'Custom Dates - Start, End'},
          {value: 'Custom Dates - Start, Duration', label: 'Custom Dates - Start, Duration'},
          {value: 'Custom Dates - End, Duration', label: 'Custom Dates - End, Duration'}
        ]
      }),
      new Types.data.number('duration', {
        numberType: 'int'
      }),
      new Types.data.date('start'),
      new Types.data.date('end'),
    ]
  })

  static filterView = new Types.view.grid({
    children: [
      new Types.view.dropDown({ref: 'filterType'}),
      new Types.view.switch({
        switch: new Types.view.dropDown({ref: 'filterType'}),
        cases: [{
          case: new Types.view.value({value: 'Custom Dates - Start, End'}),
          display: new Types.view.grid({
            children: [[
              new Types.view.calendar({
                label: 'Start Date',
                ref: 'start'
              }),
              new Types.view.calendar({
                label: 'End Date',
                ref: 'end'
              })
            ]]
          })
        }, {
          case: new Types.view.value({value: 'Custom Dates - Start, Duration'}),
          display: new Types.view.grid({
            children: [[
              new Types.view.calendar({
                label: 'Start Date',
                ref: 'start'
              }),
              new Types.view.number({
                label: 'Duration (days)',
                ref: 'duration'
              })
            ]]
          })
        }, {
          case: new Types.view.value({value: 'Custom Dates - End, Duration'}),
          display: new Types.view.grid({
            children: [[
              new Types.view.calendar({
                label: 'End Date',
                ref: 'end'
              }),
              new Types.view.number({
                label: 'Duration (days)',
                ref: 'duration'
              })
            ]]
          })
        }]
      })
    ]
  })

  onChangeFilter = (filter) => {
    this.props.renderData.options.onChange(filter);
  }

  onBlurFilter = () => {
    this.props.renderData.options.onBlur();
  }

  render() {
    return (
      <Form
        className='simple'
        viewType={CalendarFilter.filterView}
        dataType={CalendarFilter.filterData}
        model={this.props.renderData.dataValue}
        onChange={this.onChangeFilter}
        onBlur={this.onBlur}
      />
    );
  }
}

const CalendarInputPropTypes = {
  field: FormatronPropTypes.dataType.instanceOf(DateType).isRequired,
  value: React.PropTypes.any,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired,
};

class CalendarInput extends React.Component {
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

  handleBlur = (setDefault) => {
    // Wait for possible focus event before handling the blur event.
    this.blurTimeout = setTimeout(() => {
      if (setDefault && this.state.input === '') {
        this.setState({input: this.props.field.convert(moment(), 'string')})
      }
      this.saveInput();
      this.setState({showPicker: false});
      this.props.onBlur();
    });
  };

  saveInput = () => {
    this.props.onChange(this.props.field.convert(this.state.input, 'unix'));
  };

  handlePickerChange = datetime => {
    this.setState({input: this.props.field.convert(datetime, 'string')});
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
    return {
      showPicker: false,
      input: props.field.convert(props.value, 'string'),
    };
  }

  getPickerDatetime() {
    if (!this.state.input) {
      return moment();
    }
    return this.props.field.convert(this.state.input, 'datetime');
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
          type={this.props.field.getType()}

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
    const {field, disabled, placeholder} = this.props;
    return (
      <div className="formatron-input formatron-calendar">
        <input
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

CalendarInput.propTypes = CalendarInputPropTypes;

const Calendar = withDataRenderer(props => <CalendarInput {...props} />);

const StaticCalendar = withDisplayRenderer(({field, value}) =>
  <p className="formatron-static-value">
    {value}
  </p>
);

const CalendarField = withFormLabel(Calendar);
const StaticCalendarField = withStaticLabel(StaticCalendar);

export default ReactRenderer.register(
  CalendarType,
  CalendarField,
  StaticCalendarField,
  CalendarFilter,
  Calendar,
  StaticCalendar
);

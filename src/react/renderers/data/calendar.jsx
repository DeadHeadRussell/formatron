import debounce from 'debounce';
import moment from 'moment';
import TetheredComponent from 'react-tether';
import DatetimePicker from 'yet-another-datetime-picker';

import FormatronPropTypes from '~/react/propTypes';
import DateType from '~/types/data/date';
import CalendarType from '~/types/view/data/calendar';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableRangeFilter} from '../tableHelpers';
import {withDataRenderer, withDisplayRenderer} from './';

const CalendarFilter = ({viewType, renderData}) => (
  <TableRangeFilter
    viewType={viewType}
    renderData={renderData}
    parse={value => renderData.dataType.convert(value, 'unix')}
    Component={CalendarInput}
  />
);

const CalendarInputPropTypes = {
  field: FormatronPropTypes.dataType.instanceOf(DateType).isRequired,
  value: React.PropTypes.any,
  disabled: React.PropTypes.bool,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

class CalendarInput extends React.Component {
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
    this.props.onChange(this.props.field.convert(this.state.input, 'unix'));
  }

  handlePickerChange = (datetime) => {
    this.setState({input: this.props.field.convert(datetime, 'string')});
  }

  handleInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  handleClearInput = e => {
    e.stopPropagation();
    e.preventDefault();
    clearTimeout(this.blurTimeout);
    this.setState({input: ''}, this.handleBlur);
  }

  handleEnter = (event) => {
    if (event.which == 13) {
      event.preventDefault();
      event.stopPropagation();
      this.handleBlur();
    }
  }

  createInitialState(props) {
    return {
      showPicker: false,
      input: props.field.convert(props.value, 'string')
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
          element: 'formatron-tether-element-top'
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
        <div className='formatron-tether-target' />
        <DatetimePicker
          className='formatron-datetime-picker'
          onFocusCapture={this.handleFocus}
          onBlur={this.handleBlur}
          moment={this.getPickerDatetime()}
          onChange={this.handlePickerChange}
          onDone={this.handleBlur}
          onKeyPress={this.handleEnter}
          type={this.props.field.getType()}
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
    const {field, disabled, placeholder} = this.props;
    return (
      <div className='formatron-input formatron-calendar'>
        <input
          className='formatron-input-inner'
          type='text'
          value={this.state.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleInputChange}
          onKeyPress={this.handleEnter}
          placeholder={placeholder}
          disabled={disabled}
        />
        {(!disabled && this.state.input) ? (
          <button className='formatron-field-action' onClick={this.handleClearInput}>
            <span>{'\u00D7'}</span>
          </button>
        ) : null}
        {this.state.showPicker && !disabled ? this.renderPicker() : null}
      </div>
    );
  }
}

CalendarInput.propTypes = CalendarInputPropTypes;

const Calendar = withDataRenderer(props => (
  <CalendarInput {...props} />
));

const StaticCalendar = withDisplayRenderer(({field, value}) => (
  <p className='formatron-static-value'>{value}</p>
));

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

import CalendarInput from '~/react/components/calendarInput';
import Form from '~/react/components/form';
import * as Types from '~/types';
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

const Calendar = withDataRenderer(props => (
  <CalendarInput
    type={props.field.getType()}
    format={props.field.getFormat()}
    value={props.value}
    disabled={props.disabled}
    onChange={props.onChange}
    onBlur={props.onBlur}
  />
));

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

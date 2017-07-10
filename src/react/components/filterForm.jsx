import classNames from 'classnames';
import {Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import reactRenderers from '~/react/renderers';
import FormatronPropTypes from '~/react/propTypes';
import RenderData from '~/renderers/renderData';

export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState(props);
  }

  createInitialState(props) {
    return {
      changes: Map(),
      dirty: Map(),
      filters: props.filters
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.filters && newProps.filters != this.props.filters) {
      this.setState(this.createInitialState(newProps));
    }
  }

  onBlur = ref => {
    if (this.state.dirty.get(ref) || this.state.changes.get(ref)) {
      if (this.props.onChange) {
        this.props.onChange(this.state.filters);
      }
    }
  }

  onChange = (ref, value) => {
    const newFilters = this.state.filters.set(ref, value);

    this.setState({
      changes: this.state.changes.set(ref, value),
      dirty: this.state.dirty.set(ref, true),
      filters: newFilters
    });

    if (this.props.onChange) {
      this.props.onChange(newFilters);
    }
  }

  onSubmit = e => {
    e.preventDefault();

    if (!this.props.onSubmit) {
      return;
    }

    this.props.onSubmit(this.state.filters);
  }

  onReset = e => {
    this.setState(this.createInitialState(this.props));
  }

  render() {
    return (
      <form
        className={classNames('formatron-form', this.props.className)}
        onSubmit={this.onSubmit}
        onReset={this.onReset}
        noValidate='true'
      >
        {this.renderInputs()}
        {this.renderAction()}
      </form>
    );
  }

  renderInputs() {
    return (
      <div className='formatron-filters'>
        {this.props.dataType
          .getData()
          .map(fieldData => fieldData.get('field'))
          .map(field => ({
            field,
            value: this.state.filters.get(field.getName()),
            view: this.props.filterViews.get(field.getName())
          }))
          .filter(({view}) => view)
          .map(({field, value, view}) => {
            const renderData = new RenderData(field, value, {
              viewTypes: this.props.viewTypes,
              onBlur: () => this.onBlur(field.getName()),
              onChange: value => this.onChange(field.getName(), value)
            });
            return reactRenderers.renderFormFilter(view, renderData);
          })
        }
      </div>
    );
  }

  renderAction() {
    return (
      <div className={this.props.actionsClassName}>
        {this.props.actions}
      </div>
    );
  }
}

FilterForm.defaultProps = {
  filters: Map()
};

FilterForm.propTypes = {
  viewTypes: ImmutablePropTypes.map,
  dataType: FormatronPropTypes.dataType.isRequired,
  filterViews: ImmutablePropTypes.mapOf(
    FormatronPropTypes.viewType.isRequired,
    React.PropTypes.string.isRequired
  ).isRequired,
  filters: ImmutablePropTypes.map,

  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,

  className: React.PropTypes.string,

  actionsClassName: React.PropTypes.string,
  actions: React.PropTypes.arrayOf(React.PropTypes.element)
};


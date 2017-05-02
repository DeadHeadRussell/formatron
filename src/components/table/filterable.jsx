import {Map} from 'immutable';
import DebounceInput from 'react-debounce-input';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BaseTable from './base';

export default function filterableTable(Table) {
  return class FilterableTable extends BaseTable {
    static propTypes = {
      showFilterButton: React.PropTypes.bool,
      showFilterFields: React.PropTypes.bool,
      filtering: React.PropTypes.bool,
      onFilter: React.PropTypes.func,
      filters: ImmutablePropTypes.mapOf(
        React.PropTypes.any.isRequired,
        React.PropTypes.string.isRequired
      )
    }

    static defaultProps = {
      showFilterButton: true,
      showFilterFields: true
    }

    constructor(props) {
      super(props);
      this.toggleFilter = this.toggleFilter.bind(this);

      this.state = this.createInitialState();
    }

    createInitialState() {
      return {
        filtering: false,
        filters: Map()
      };
    }

    toggleFilter() {
      if (this.state.filtering) {
        this.setState(this.createInitialState());
      } else {
        this.setState({filtering: true});
      }
    }

    onFilterChange(column) {
      return e => {
        const filterValue = e.target.value;
        this.props.onFilter ?
          this.props.onFilter(column, filterValue) :
          this.onFilter(column, filterValue);
      };
    }

    getHeaderRowHeight = height => {
      return height + 41;
    }

    headerRowRenderer = renderer => {
      return props => renderer({
        ...props,
        extraHeaderRowHeight: 41
      });
    }

    headerRenderer = renderer => {
      return (column, props) => <div>
        {renderer(column, props)}
        {this.inputFilterRenderer(column)}
      </div>;
    }

    getToolbarButtons = buttons => {
      if (this.props.showFilterButton) {
        return buttons
          .push(<button
            key='filter-toggle'
            type='button'
            className='table-filterable-filter'
            onClick={this.toggleFilter}
          >
            Filter
          </button>);
      } else {
        return buttons;
      }
    }

    rowsModifier = rows => {
      return rows
        .filter(this.filterModel);
    }

    inputFilterRenderer(column) {
      if (column.label) {
        return <DebounceInput
          className='form-filter-input'
          value={this.getFilters().getIn([column.label, 'value'], '')}
          debounceTimeout={100}
          onChange={this.onFilterChange(column)}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
        />;
      } else {
        return null;
      }
    }

    isFiltering() {
      return this.props.filtering || this.state.filtering;
    }

    getFilters() {
      return this.props.filters || this.state.filters;
    }

    onFilter(column, filterValue) {
      if (filterValue) {
        this.setState({
          filters: this.state.filters
            .set(column.label, filterValue)
        });
      } else {
        this.setState({
          filters: this.state.filters
            .remove(column.label)
        });
      }
    }

    filterModel = model => {
      const columns = this.props.schema.getColumns();
      return this.getFilters()
        .every((filterValue, label) => {
          const column = columns.find(column => column.label == label);
          if (!column) {
            return true;
          }

          const rowValue = column.getCell(model, {preferQuick: false});

          if (typeof filterValue == 'function') {
            return filterValue(rowValue, model);
          }

          if (rowValue !== null && typeof rowValue != 'undefined') {
            const valueString = rowValue.toString().toLowerCase();
            const filterString = filterValue.toLowerCase();
            return valueString.indexOf(filterString) != -1;
          }

          return false;
        });
    }

    render() {
      if (this.isFiltering()) {
        const newProps = this.props.showFilterFields ? {
          getHeaderRowHeight: this.getHeaderRowHeight,
          headerRowRenderer: this.headerRowRenderer,
          headerRenderer: this.headerRenderer,
          getToolbarButtons: this.getToolbarButtons,
          rowsModifier: this.rowsModifier
        } : {
          getToolbarButtons: this.getToolbarButtons,
          rowsModifier: this.rowsModifier
        };

        const mergedProps = this.mergeProps(newProps);

        return <Table
          ref={table => this.table = table}
          {...mergedProps}
        />;
      } else {
        return <Table
          ref={table => this.table = table}
          {...this.mergeProps({
            getToolbarButtons: this.getToolbarButtons
          })}
        />;
      }
    }
  };
}


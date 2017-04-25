import {Map} from 'immutable';
import DebounceInput from 'react-debounce-input';

import BaseTable from './base';

export default function filterableTable(Table) {
  class FilterableTable extends BaseTable {
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
        if (filterValue) {
          this.setState({
            filters: this.state.filters
              .set(column.label, Map({
                value: filterValue,
                column
              }))
          });
        } else {
          this.setState({
            filters: this.state.filters.remove(column.label)
          });
        }
      };
    }

    headerRowRenderer = renderer => {
      return props => renderer({
        ...props,
        style: {
          ...props.style,
          height: '75px'
        }
      });
    }

    headerRenderer = renderer => {
      return (column, props) => <div>
        {renderer(column, props)}
        {this.inputFilterRenderer(column)}
      </div>;
    }

    getToolbarButtons = buttons => {
      return buttons
        .push(<button
          key='filter-toggle'
          type='button'
          className='table-filterable-filter'
          onClick={this.toggleFilter}
        >
          Filter
        </button>);
    }

    rowsModifier = rows => {
      return rows
        .filter(this.filterModel);
    }

    inputFilterRenderer(column) {
      return <DebounceInput
        className='form-filter-input'
        value={this.state.filters.getIn([column.label, 'value'], '')}
        debounceTimeout={100}
        onChange={this.onFilterChange(column)}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      />;
    }

    filterModel = model => {
      return this.state.filters
        .every((filter, label) => {
          const rowValue = filter.get('column').getCell(model, {
            preferQuick: true
          });

          if (rowValue !== null && typeof rowValue != 'undefined') {
            const valueString = rowValue.toString().toLowerCase();
            const filterString = filter.get('value').toLowerCase();
            return valueString.indexOf(filterString) != -1;
          } else {
            return false;
          }
        });
    }

    render() {
      if (this.state.filtering) {
        const mergedProps = this.mergeProps({
          headerRowRenderer: this.headerRowRenderer,
          headerRenderer: this.headerRenderer,
          getToolbarButtons: this.getToolbarButtons,
          rowsModifier: this.rowsModifier
        });

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
  }

  FilterableTable.propTypes = {
    onFilter: React.PropTypes.func
  };

  return FilterableTable;
}


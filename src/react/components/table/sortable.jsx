import SortDirection from 'react-virtualized/dist/commonjs/Table/SortDirection';

import RenderData from '~/renderers/renderData';
import reactRenderers from '~/react/renderers';

import BaseTable from './base';

export default function sortableTable(Table) {
  return class SortableTable extends BaseTable {
    static propTypes = {
      sortable: React.PropTypes.bool,
      initialSort: React.PropTypes.shape({
        sortBy: React.PropTypes.string,
        sortDirection: React.PropTypes.string
      }),
      onSort: React.PropTypes.func,
      sortBy: React.PropTypes.string,
      sortDirection: React.PropTypes.string
    };

    static defaultProps = {
      ...BaseTable.defaultProps,
      sortable: true,
      initialSort: {}
    };

    constructor(props) {
      super(props);

      this.state = this.createInitialState();
    }

    createInitialState() {
      return {
        sortBy: this.props.initialSort.sortBy,
        sortDirection: this.props.initialSort.sortDirection
      };
    }

    // Only sort if you are non-infinite load, or if you have an `onSort` prop.
    isSortable = () => {
      return this.props.sortable && (
        !this.props.infiniteLoad ||
        !!this.props.onSort
      );
    }

    onSort = props => {
      if (this.props.onSort) {
        this.props.onSort(props);
      } else if (!this.props.infiniteLoad) {
        // The default sort implementation does not support tables with
        // infinite loading since we only sort rows that are currently loaded.
        if (this.state.sortBy == this.props.sortBy &&
            this.state.sortDirection == SortDirection.DESC) {
          this.setState(this.createInitialState());
        } else {
          this.setState(props);
        }
      }
    }

    doSort() {
      return !!this.getSortBy();
    }

    getSortBy() {
      return this.props.sortBy || this.state.sortBy;
    }

    getSortDirection() {
      return this.props.sortDirection || this.state.sortDirection;
    }

    getColumnProps = getter => {
      return column => ({
        ...getter(column),
        sortable: column.isSortable
      });
    }

    rowsModifier = rows => {
      const renderData = new RenderData(this.props.dataType, null, {
        viewTypes: this.props.viewTypes,
        ...this.props.renderOptions
      });

      const columnProps = this.props.columns
        .map(column => reactRenderers.getTableProps(column, renderData))
        .find(columnProps => columnProps.label == this.getSortBy());

      const getSortValue = function(row) {
        renderData.dataValue = row;
        return columnProps.viewType.getValue(renderData);
      };

      if (!columnProps) {
        return rows;
      }

      return rows
        .update(models => this.doSort() ?
          models
            .sortBy(getSortValue, (a, b) => {
              // TODO: Put sort in the column props like filter is?
              const nullA = (a === null || typeof a == 'undefined');
              const nullB = (b === null || typeof b == 'undefined');
              if (nullA && nullB) {
                return 0;
              } else if (nullA) {
                return 1;
              } else if (nullB) {
                return -1;
              } else {
                return a > b ? 1 : a < b ? -1 : 0;
              }
            })
            .update(models =>
                this.getSortDirection() == SortDirection.DESC ?
                  models.reverse() :
                  models
            ) :
          models
        );
    }

    render() {
      if (this.isSortable()) {
        const mergedProps = this.mergeProps({
          getColumnProps: this.getColumnProps,
          rowsModifier: this.rowsModifier,
          sort: this.onSort,
          sortBy: this.getSortBy(),
          sortDirection: this.getSortDirection()
        });

        return (
          <Table
            ref={table => this.table = table}
            {...mergedProps}
          />
        );
      } else {
        return (
          <Table
            ref={table => this.table = table}
            {...this.mergeProps({})}
          />
        );
      }
    }
  }
}


import {Map} from 'immutable';

import BaseTable from './base';

export default function editableColumnsTable(Table) {
  return class EditableColumnsTable extends BaseTable {
    constructor(props) {
       super(props);
       this.state = this.createInitialState();
    }

    createInitialState() {
      return {
        columnSizes: Map()
      };
    }

    getColumnProps = getter => {
      return column => {
        if (this.state.columnSizes.get(column.label)) {
          return {
            ...getter(column),
            width: this.state.columnSizes.get(column.label),
            flexGrow: 0,
            flexShrink: 0
          };
        } else {
          return getter(column);
        }
      };
    }

    headerRenderer = column => {
      return props => {
        //
      };
    }

    render() {
      return <Table
        ref={table => this.table = table}
        {...this.props}
      />;
    }
  };
}

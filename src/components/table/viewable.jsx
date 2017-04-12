import Column from 'react-virtualized/dist/commonjs/Table/Column';

import BaseTable from './base';

export default function viewableTable(Table) {
  return class ViewableTable extends BaseTable {
    static propTypes = {
      viewRenderer: React.PropTypes.func
    }

    columnsRenderer = columns => {
      return columns
        .unshift(<Column
          label='View Button'
          dataKey=''
          width={100}
          flexGrow={0}
          flexShrink={0}
          cellDataGetter={() => null}
          cellRenderer={props => this.props.viewRenderer(
            props.index,
            props.rowData
          )}
          headerRenderer={() => null}
        />);
    }

    render() {
      if (this.props.viewRenderer) {
        return <Table
          ref={table => this.table = table}
          {...this.mergeProps({
            columnsRenderer: this.columnsRenderer
          })}
        />;
      } else {
        return <Table {...this.props} />;
      }
    }
  };
}

import TetheredComponent from 'react-tether';

import BaseTable from './base';

export default function exportableTable(Table) {
  return class ExportableTable extends BaseTable {
    static propTypes = {
      onExport: React.PropTypes.func
    }

    getToolbarButtons = buttons => {
      return this.props.onExport
        ? buttons
          .push((
            <button
              key='export-toggle'
              type='button'
              className='formatron-table-button formatron-table-exportable-export'
              onClick={this.export}
            >
              Export
            </button>
          ))
        : buttons;
    }

    export = () => {
      this.props.onExport();
    }

    render() {
      return <Table
        ref={table => this.table = table}
        {...this.mergeProps({
          getToolbarButtons: this.getToolbarButtons
        })}
      />;
    }
  };
}


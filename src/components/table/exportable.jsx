import BaseTable from './base';

export default function exportableTable(Table) {
  return class ExportableTable extends BaseTable {
    render() {
      return <Table
        ref={table => this.table = table}
        {...this.props}
      />;
    }
  };
}

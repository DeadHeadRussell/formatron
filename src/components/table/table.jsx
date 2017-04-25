import {List} from 'immutable';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import defaultHeaderRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRenderer';
import defaultHeaderRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRowRenderer';
import defaultRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import Table from 'react-virtualized/dist/commonjs/Table';

import Loading from '~/components/loading';

import BaseTable from './base';

export default class SchemaTable extends BaseTable {
  static propTypes = {
    height: React.PropTypes.number,
    onButtonClick: React.PropTypes.func
  }

  reduce(renderers, value) {
    return renderers
      .reduce((value, renderer) => renderer(value), value);
  }

  columnsRenderer() {
    return this.reduce(
      this.props.columnsRenderers,
      this.props.schema.getColumns()
        .map(column => this.columnRenderer(column))
    );
  }

  columnRenderer(column) {
    return this.reduce(
      this.props.columnRenderers,
      column => <Column
        key={column.label}
        {...this.getColumnProps(column)}
      />
    )(column);
  }

  getColumnProps(column) {
    return this.reduce(
      this.props.getColumnProps,
      column => ({
        label: column.label,
        dataKey: column.label,
        width: 100,
        flexGrow: 1,
        flexShrink: 1,
        cellDataGetter: () => null,
        cellRenderer: this.cellRenderer(column),
        headerRenderer: this.headerRenderer(column)
      })
    )(column);
  }

  headerRowRenderer(models) {
    const buttons = this.reduce(
      this.props.getToolbarButtons,
      List()
    );

    return this.reduce(
      this.props.headerRowRenderers,
      props => (models.size) > 0 ? (
        <div>
          <div>{buttons}</div>
          {defaultHeaderRowRenderer(props)}
        </div>
      ) : <div />
    );
  }

  rowsModifier(models) {
    return this.reduce(
      this.props.rowsModifiers,
      models
        .map((model, index) => model
          .set(BaseTable.naturalIndex, index)
        )
    );
  }

  rowGetter(models) {
    return this.reduce(
      this.props.rowGetters,
      props => models.get(props.index)
    );
  }

  rowRenderer() {
    return this.reduce(
      this.props.rowRenderers,
      props => defaultRowRenderer(props)
    );
  }

  noRowsRenderer() {
    return this.reduce(
      this.props.noRowsRenderers,
      () => <div>
        {this.props.loading ?
          <Loading /> :
          <p>No rows.</p>
        }
      </div>
    );
  }

  cellRenderer(column) {
    return this.reduce(
      this.props.cellRenderers,
      (column, {rowData, isScrolling}) => {
        const cellValue = column
          .getCell(rowData, {
            preferQuick: isScrolling
          });
        if (typeof cellValue == 'function') {
          return cellValue({
            onButtonClick: (...args) => {
              if (this.props.onButtonClick) {
                const index = rowData.get(this.naturalIndex);
                this.props.onButtonClick(index, rowData, ...args);
              }
            }
          });
        }
        return cellValue;
      }
    ).bind(null, column);
  }

  headerRenderer(column) {
    return this.reduce(
      this.props.headerRenderers,
      (columm, props) => defaultHeaderRenderer(props)
    ).bind(null, column);
  }

  render() {
    const models = this.rowsModifier(this.props.models);

    // This has the `form` class since CSS classes are a mess (#26).
    return <AutoSizer>
      {({width, height}) => <Table
        ref={table => this.table = table}
        className='form table'
        width={width}
        height={this.props.height || height}

        headerHeight={40}
        headerRowRenderer={this.headerRowRenderer(this.props.models)}

        rowHeight={40}
        rowCount={models.size}
        rowRenderer={this.rowRenderer()}
        rowGetter={this.rowGetter(models)}
        noRowsRenderer={this.noRowsRenderer()}

        sort={this.props.sort}
        sortBy={this.props.sortBy}
        sortDirection={this.props.sortDirection}
      >
        {this.columnsRenderer()}
      </Table>}
    </AutoSizer>;
  }
}


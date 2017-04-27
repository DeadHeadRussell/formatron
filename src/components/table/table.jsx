import {List} from 'immutable';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import defaultHeaderRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRenderer';
import defaultHeaderRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRowRenderer';
import defaultRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import Table from 'react-virtualized/dist/commonjs/Table';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';

import Loading from '~/components/loading';

import BaseTable from './base';

export default class SchemaTable extends BaseTable {
  static propTypes = {
    size: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(['window', 'auto']).isRequired,
      React.PropTypes.shape({
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
      }).isRequired
    ]),
    onButtonClick: React.PropTypes.func,
    headerRowHeight: React.PropTypes.number,
    toolbarRowHeight: React.PropTypes.number
  }

  static defaultProps = {
    size: 'auto',
    headerRowHeight: 40,
    toolbarRowHeight: 30
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
      column => {
        const sizing = column.getSizing();
        return {
          label: column.label,
          dataKey: column.key,
          width: sizing.width,
          flexGrow: sizing.grow,
          flexShrink: sizing.shrink,
          cellDataGetter: () => null,
          cellRenderer: this.cellRenderer(column),
          headerRenderer: this.headerRenderer(column)
        };
      }
    )(column);
  }

  getLocalHeaderRowHeight(buttons, props) {
    const toolbarFactor = buttons.size > 0 ?
      1 : 0;

    const extraHeight = props ? (
      (props.extraHeaderRowHeight || 0) +
      (props.extraToolbarRowHeight || 0)
    ) : 0;

    return this.props.headerRowHeight +
      (this.props.toolbarRowHeight * toolbarFactor) +
      extraHeight;
  }

  headerRowHeight() {
    const buttons = this.reduce(
      this.props.getToolbarButtons,
      List()
    );

    return this.reduce(
      this.props.getHeaderRowHeight,
      this.getLocalHeaderRowHeight(buttons)
    );
  }

  headerRowRenderer() {
    const buttons = this.reduce(
      this.props.getToolbarButtons,
      List()
    );

    // The toolbar buttons currently mess up the height calculations.
    return this.reduce(
      this.props.headerRowRenderers,
      props => (this.props.models.size) > 0 ? (
        <div
          className='formatron-table-header'
          style={{
            width: props.style.width,
            height: this.getLocalHeaderRowHeight(buttons, props)
          }}>
          {buttons.size > 0 ? (
            <div
              className='formatron-table-toolbar'
              style={{
                width: props.style.width,
                height: this.props.toolbarRowHeight +
                  (props.extraToolbarRowHeight || 0)
              }}
            >{buttons}</div>
          ) : null}
          {defaultHeaderRowRenderer({
            ...props,
            style: {
              ...props.style,
              height: this.props.headerRowHeight +
                (props.extraHeaderRowHeight || 0)
            }
          })}
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
      props => defaultRowRenderer({
        ...props,
        className: props.className + ((props.index % 2 == 0) ?
          ' formatron-table-row-even' :
          ' formatron-table-row-odd'
        )
      })
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

  renderTable(props, models) {
    return <Table
      {...props}
      ref={table => this.table = table}
      className='form table'

      headerHeight={this.headerRowHeight()}
      headerRowRenderer={this.headerRowRenderer()}

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
    </Table>;
  }

  render() {
    const models = this.rowsModifier(this.props.models);

    // This has the `form` class since CSS classes are a mess (#26).
    return this.props.size == 'auto' ? (
      <AutoSizer>
        {props => this.renderTable(props, models)}
      </AutoSizer>
    ) : this.props.size == 'window' ? (
      <AutoSizer>
        {({width}) => <WindowScroller key={width}>
          {props => this.renderTable({
            ...props,
            width,
            autoHeight: true
          }, models)}
        </WindowScroller>}
      </AutoSizer>
    ) : (
      this.renderTable({
        width: this.props.size.width,
        height: this.props.size.height
      }, models)
    );
  }
}


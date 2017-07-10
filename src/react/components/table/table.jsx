import {List, Map} from 'immutable';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import defaultCellRangeRenderer from 'react-virtualized/dist/commonjs/Grid/defaultCellRangeRenderer';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import defaultHeaderRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRenderer';
import defaultHeaderRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultHeaderRowRenderer';
import defaultRowRenderer from 'react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import Table from 'react-virtualized/dist/commonjs/Table';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';

import Loading from '~/react/components/loading';
import reactRenderers from '~/react/renderers';
import RenderData from '~/renderers/renderData';

import BaseTable from './base';

export default class SchemaTable extends BaseTable {
  static propTypes = {
    ...BaseTable.propTypes,
    size: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(['window', 'auto', 'fit']).isRequired,
      React.PropTypes.shape({
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number
      }).isRequired
    ]),
    maxHeight: React.PropTypes.number,
    rowHeight: React.PropTypes.number,
    style: React.PropTypes.object,
    onButtonClick: React.PropTypes.func,
    headerRowHeight: React.PropTypes.number,
    toolbarRowHeight: React.PropTypes.number
  }

  static defaultProps = {
    ...BaseTable.defaultProps,
    size: 'auto',
    rowHeight: 40,
    style: {},
    headerRowHeight: 40,
    toolbarRowHeight: 30
  }

  constructor(props) {
    super(props);
    this.cellCache = Map();
  }

  getRows() {
    return this.models;
  }

  reduce(renderers, value) {
    return renderers
      .reduce((value, renderer) => renderer(value), value);
  }

  columnsRenderer() {
    return this.reduce(
      this.props.columnsRenderers,
      this.props.columns
        .map(column => this.columnRenderer(column))
    );
  }

  columnRenderer(column) {
    return this.reduce(
      this.props.columnRenderers,
      column => <Column
        {...this.getColumnProps(column)}
      />
    )(column);
  }

  getColumnProps(column) {
    const renderData = new RenderData(null, null, {
      viewTypes: this.props.viewTypes
    });

    return this.reduce(
      this.props.getColumnProps,
      column => ({
        ...reactRenderers.getTableProps(column, renderData),
        cellDataGetter: () => null,
        cellRenderer: this.cellRenderer(column),
        headerRenderer: this.headerRenderer(column)
      })
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
      (column, {rowData}) => {
        const key = `${column.uniqueId}-${rowData.get(BaseTable.naturalIndex)}`;
        if (!this.cellCache.has(key)) {
          const renderData = new RenderData(this.props.dataType, rowData, {
            viewTypes: this.props.viewTypes,
            onButtonClick: (...args) => {
              if (this.props.onButtonClick) {
                const index = rowData.get(this.naturalIndex);
                this.props.onButtonClick(index, rowData, ...args);
              }
            }
          });

          this.cellCache = this.cellCache
            .set(key, reactRenderers
              .renderStaticTableCell(column, renderData)
            );
        }
        return this.cellCache.get(key);
      }
    ).bind(null, column);
  }

  headerRenderer(column) {
    return this.reduce(
      this.props.headerRenderers,
      (columm, props) => defaultHeaderRenderer(props)
    ).bind(null, column);
  }

  getTableHeight() {
    const headerHeight = this.headerRowHeight();

    const gridHeight = this.props.models.size > 0 ?
      this.props.models.size * this.props.rowHeight :
      30;

    return gridHeight + headerHeight;
  }

  renderTable(props, models) {
    const height = props.height || 0;
    const maxHeight = this.props.maxHeight || Infinity;

    return <Table
      {...props}
      ref={table => this.table = table}
      className='formatron-table'
      style={this.props.style}
      height={Math.min(height, maxHeight)}

      cellRangeRenderer={props => defaultCellRangeRenderer({
        ...props,
        // Fake that we aren't scrolling so that their internal cache does not
        // conflict with our cell caching. This will otherwise cause issues
        // when a table's natural order is changed (eg, sorting, filtering).
        isScrolling: false
      })}

      headerHeight={this.headerRowHeight()}
      headerRowRenderer={this.headerRowRenderer()}

      rowHeight={this.props.rowHeight}
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
    this.models = models;

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
    ) : this.props.size == 'fit' ? (
      <AutoSizer>
        {({width}) => this.renderTable({
          width,
          height: this.getTableHeight()
        }, models)}
      </AutoSizer>
    ) : (
      this.renderTable({
        width: this.props.size.width,
        height: this.props.size.height || this.getTableHeight()
      }, models)
    );
  }
}


import {List, Map} from 'immutable';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import defaultCellRangeRenderer from 'react-virtualized/dist/commonjs/Grid/defaultCellRangeRenderer';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
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

  componentDidMount() {
    this.initialize(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.columns.equals(this.props.columns) || !newProps.models.equals(this.props.models)) {
      this.initialize(newProps);
    }
  }

  initialize(props) {
    props.models
      .forEach(model => props.columns
        .forEach(viewType => reactRenderers
          .initialize(viewType, new RenderData(props.dataType, model, {
            viewTypes: props.viewTypes,
            ...props.renderOptions
          }))
        )
      );
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
      viewTypes: this.props.viewTypes,
      ...this.props.renderOptions
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
      props => (this.models.size) > 0 ? (
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
        .map((model, index) => model && model
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
      props => {
        if (!this.models.get(props.index)) {
          return <div style={{height: this.props.rowHeight}}>
            <Loading />
          </div>;
        }
        return defaultRowRenderer({
          ...props,
          className: props.className + ((props.index % 2 == 0) ?
            ' formatron-table-row-even' :
            ' formatron-table-row-odd'
          )
        });
      }
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
        if (!rowData) {
          return <div />;
        }

        const renderData = new RenderData(this.props.dataType, rowData, {
          viewTypes: this.props.viewTypes,
          ...this.props.renderOptions,
          onButtonClick: (...args) => {
            if (this.props.onButtonClick) {
              const index = rowData.get(BaseTable.naturalIndex);
              this.props.onButtonClick(index, rowData, ...args);
            }
          }
        });

        const columnId = typeof column == 'string' ? column : column.uniqueId;
        const display = reactRenderers.getDisplay(column, renderData);
        const key = `${columnId}-${rowData.get(BaseTable.naturalIndex)}-${display}`;
        if (!this.cellCache.has(key)) {
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

    const gridHeight = this.models.size > 0 ?
      this.models.size * this.props.rowHeight :
      40;

    return gridHeight + headerHeight;
  }

  renderTable(props, models) {
    const height = props.height || 0;
    const maxHeight = this.props.maxHeight || Infinity;

    return <Table
      {...props}
      ref={table => {
        props.registerChild && props.registerChild(table);
        this.table = table;
      }}
      className='formatron-table'
      style={this.props.style}
      height={Math.min(height, maxHeight)}

      onRowsRendered={props.onRowsRendered}

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
      rowCount={this.props.models.size}
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

  renderSizing(models, infiniteProps = {}) {
    return this.props.size == 'auto' ? (
      <AutoSizer>
        {props => this.renderTable({
          ...infiniteProps,
          ...props
        }, models)}
      </AutoSizer>
    ) : this.props.size == 'window' ? (
      <AutoSizer disableHeight>
        {({width}) => <WindowScroller key={width}>
          {props => this.renderTable({
            ...infiniteProps,
            ...props,
            width,
            autoHeight: true
          }, models)}
        </WindowScroller>}
      </AutoSizer>
    ) : this.props.size == 'fit' ? (
      <AutoSizer disableHeight>
        {({width}) => this.renderTable({
          ...infiniteProps,
          width,
          height: this.getTableHeight()
        }, models)}
      </AutoSizer>
    ) : (
      this.renderTable({
        ...infiniteProps,
        width: this.props.size.width,
        height: this.props.size.height || this.getTableHeight()
      }, models)
    );
  }

  render() {
    const models = this.rowsModifier(this.props.models);
    this.models = models;

    return this.props.infiniteLoad
      ? (
        <InfiniteLoader
          isRowLoaded={({index}) => !!this.props.models.get(index)}
          loadMoreRows={this.props.loadMoreRows}
          rowCount={this.props.models.size}
        >
          {props => this.renderSizing(models, props)}
        </InfiniteLoader>
      )
      : this.renderSizing(models);
  }
}


import {List, Map} from 'immutable';
import React, {PureComponent} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FormatronPropTypes from '~/react/renderers/propTypes';
import ListType from '~/types/data/list';

const renderersPropType = ImmutablePropTypes.listOf(
  React.PropTypes.func.isRequired
);

export default class BaseTable extends PureComponent {
  static naturalIndex = Symbol('naturalIndex')

  static defaultProps = {
    columnsRenderers: List(),
    columnRenderers: List(),
    getColumnProps: List(),
    getHeaderRowHeight: List(),
    headerRowRenderers: List(),
    getToolbarButtons: List(),
    rowsModifiers: List(),
    rowGetters: List(),
    rowRenderers: List(),
    noRowsRenderers: List(),
    cellRenderers: List(),
    headerRenderers: List(),

    viewTypes: Map(),
    models: List()
  }

  static propTypes = {
    columnsRenderers: renderersPropType,
    columnRenderers: renderersPropType,
    getColumnProps: renderersPropType,
    getHeaderRowHeight: renderersPropType,
    headerRowRenderers: renderersPropType,
    getToolbarButtons: renderersPropType,
    rowsModifiers: renderersPropType,
    rowGetters: renderersPropType,
    rowRenderers: renderersPropType,
    noRowsRenderers: renderersPropType,
    cellRenderers: renderersPropType,
    headerRenderers: renderersPropType,

    className: React.PropTypes.string,
    viewTypes: ImmutablePropTypes.map,
    columns: ImmutablePropTypes.listOf(
      FormatronPropTypes.viewType.isRequired
    ).isRequired,
    dataType: FormatronPropTypes.dataType.instanceOf(ListType).isRequired,
    models: ImmutablePropTypes.listOf(
      ImmutablePropTypes.map.isRequired
    ),
    loading: React.PropTypes.bool
  }

  forceUpdateGrid() {
    return this.table && this.table.forceUpdateGrid();
  }

  getRows() {
    return this.table && this.table.getRows();
  }

  getColumns() {
    return this.table && this.table.getColumns();
  }

  mergeProps(newProps) {
    const propNames = {
      columnsRenderer: 'columnsRenderers',
      columnRenderer: 'columnRenderers',
      getColumnProps: 'getColumnProps',
      getToolbarButtons: 'getToolbarButtons',
      getHeaderRowHeight: 'getHeaderRowHeight',
      headerRowRenderer: 'headerRowRenderers',
      rowsModifier: 'rowsModifiers',
      rowGetter: 'rowGetters',
      rowRenderer: 'rowRenderers',
      noRowsRenderer: 'noRowsRenderers',
      cellRenderer: 'cellRenderers',
      headerRenderer: 'headerRenderers'
    };

    return {
      ...this.props,
      ...Map(newProps)
        .mapEntries(([key, value]) => propNames[key] ? [
          propNames[key],
          this.props[propNames[key]].push(value)
        ] : [
          key,
          value
        ])
        .toObject()
    };
  }
};


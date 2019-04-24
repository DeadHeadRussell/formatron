import {List, Map} from 'immutable';
import React, {PureComponent} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FormatronPropTypes from '~/react/propTypes';
import * as Types from '~/types';

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
    models: List(),
    renderOptions: {}
  };

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
    viewTypes: React.PropTypes.oneOfType([
      ImmutablePropTypes.map,
      React.PropTypes.func
    ]),
    columns: ImmutablePropTypes.listOf(
      FormatronPropTypes.viewType.isRequired
    ).isRequired,
    dataType: FormatronPropTypes.dataType.instanceOf(Types.data.list).isRequired,
    models: ImmutablePropTypes.listOf(
      ImmutablePropTypes.map
    ),
    renderOptions: React.PropTypes.object,
    loading: React.PropTypes.bool
  };

  static propNames = {
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

  forceUpdateGrid() {
    return this.table && this.table.forceUpdateGrid();
  }

  setModels(models) {
    return this.table && this.table.setModels(models);
  }

  getRows() {
    return this.table && this.table.getRows();
  }

  mergeProps(newProps) {
    return {
      ...this.props,
      ...Map(newProps)
        .mapEntries(([key, value]) => BaseTable.propNames[key] ? [
          BaseTable.propNames[key],
          this.props[BaseTable.propNames[key]].push(value)
        ] : [
          key,
          value
        ])
        .toObject()
    };
  }
};


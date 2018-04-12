import Immutable, {List, Map} from 'immutable';

import {valueRenderers} from '~/renderers';

import Type from '../type';

let viewIds = 0;

/**
 * The base view type. Every registered view type must eventually inherit from this.
 */
export default class ViewType extends Type {
  static typeName = '';

  static parseOptions(field, parseField) {
    return field
      .remove('type')
      .update('label', label => Map.isMap(label) ?
        parseField(label) :
        label
      );
  }

  /**
   * Base class implementation that children can call such as:
   *   `super.initialize(this.getChildren())`
   * If a child does not override this, it means that this function will be
   * called with no arguments, which is a no-op.
   *
   * @param {RenderData} renderData - the render data to initialize the type to.
   * @param {ViewType|List<ViewType>} children - a single view type or a list of view types to call initialize on
   */
  initialize(renderData, children) {
    const label = this.options.get('label');
    const labelPromise = label instanceof ViewType
      ? valueRenderers.initialize(label, renderData)
      : null;

    const childrenPromises = List.isList(children)
      ? children
        .map(child => valueRenderers.initialize(child, renderData))
        .toArray()
      : children
        ? [valueRenderers.initialize(children, renderData)]
        : [];

    return Promise.all([...childrenPromises, labelPromise]);
  }

  /**
   * Creates a new instance of a view type.
   * @param {object} options - Options to apply to this instance.
   */
  constructor(options) {
    super();
    this.options = Immutable.fromJS(options || {});
    this.uniqueId = viewIds++;
  }

  // TODO: Put default width / min width as overrideable by each sub view type.
  // TODO: Separate form / table width options so that you can specify a single
  // view for each.
  getWidth() {
    return this.options.get('width');
  }

  getMinWidth() {
    return this.options.has('width')
      ? this.options.get('minWidth')
      : this.options.get('minWidth', 180);
  }

  getDefaultFlex() {
    return this.options.has('width') ? 0 : 1;
  }

  getFlexGrow() {
    return this.options.get('flexGrow', this.getDefaultFlex());
  }

  getFlexShrink() {
    return this.options.get('flexShrink', this.getDefaultFlex());
  }

  /**
   * Returns a label using 1 of 3 options. If the internal label is a basic
   * value, return it. If it is a view type, get its associated display value.
   * If it is a function, call the function with the render data.
   *
   * @param {RenderData} renderData - The data to maybe generate the label from.
   * @param {ViewType|string} secondLabel - A second label to use in place of the built in label.
   * @return {string} They label, if any, associated with the view.
   */
  getLabel(renderData, secondLabel) {
    const label = secondLabel || this.options.get('label') || '';
    if (label instanceof ViewType) {
      return label.getDisplay(renderData);
    } else if (typeof label == 'function') {
      return label(renderData);
    }
    return label;
  }

  /**
   * Returns display information for table based displays.
   * Currently, the only display used is react-virtualized, so the options are
   * entirely based on that library.
   *
   * For a view type to be used as a table column, it must have a string label.
   * TODO: Consider allowing any labels, but pass in "dummy" render data that
   * always returns empty (or default) values. In the current setup, this would
   * work by just passing the data type and using `undefined` for the data
   * value.
   *
   * If a width is supplied to the view type, the default shrink / grow factor
   * is 0. Otherwise, the default factor is 1 and the default width is 100.
   *
   * @return {object}
   */
  getTableProps(label) {
    label = typeof label != 'undefined' ?
      label :
      (this.options.get('label') || '');

    if (typeof label != 'string') {
      throw new Error(`Error ${this.constructor.name}: labels must only be plain strings when used with tables.`);
    }

    return {
      key: label,
      viewType: this,
      label: label,
      dataKey: label,
      width: this.getWidth() || 140,
      minWidth: this.getMinWidth(),
      flexGrow: this.getFlexGrow(),
      flexShrink: this.getFlexShrink(),
      filterType: 'equals',
      filter: this.filter.bind(this)
    };
  }

  filter(filterValue, rowValue) {
    return filterValue == rowValue;
  }

  asType(Type) {
    const newType = new this.constructor(this.options);
    newType.constructor = Type;
    return newType;
  }
}


import {List} from 'immutable';

import {parseRef, ImmutableRef} from '~/refs';

import ViewType from '../';

/**
 * The base view type for displaying data from the model.
 * @extends ViewType
 */
export default class DataType extends ViewType {
  static typeName = 'data';

  /**
   * The default ref. This references the root of a passed in value (aka, the value itself).
   */
  static defaultRef = new ImmutableRef('');

  /**
   * Parses the `ref` option into a {@Ref} type.
   * @return {Immutable.Map} The parsed options.
   */
  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('defaultValue', field => field && parseField(field))
      .update('ref', this.parseOneOrMany(parseRef));
  }

  constructor(options) {
    super(options);
    this.options = this.options
      .update('ref', this.constructor.parseOneOrMany(parseRef));
  }

  initialize(renderData) {
    const {field, value} = this.getFieldAndValue(renderData);
    return field && field.initialize
      ? field.initialize(value, renderData.options)
      : Promise.resolve();
  }

  /**
   * Returns the reference to the underlying data. Defaults to an empty 
   * @return {Ref}
   */
  getRef() {
    const refs = this.options.get('ref') || this.constructor.defaultRef;
    if (List.isList(refs)) {
      return refs;
    } else {
      return List([refs]);
    }
  }

  /**
   * Returns whether the underlying data type should be editable or not.
   * Defaults to `true`.
   * @return {bool} `true` if editable.
   */
  isEditable() {
    const editable = this.options.get('editable');
    return typeof editable == 'undefined' ?
      true :
      !!editable;
  }

  /**
   * @return {string} A placeholder associated with the view.
   */
  getPlaceholder() {
    return this.options.get('placeholder') || '';
  }

  /**
   * @return {ViewType} A default value encoded as a view type.
   */
  getDefaultValue() {
    return this.options.get('defaultValue');
  }

  /**
   * @param {RenderData} renderData - The render data to get the value of.
   * @return {object} The underlying value of the data type.
   */
  getValue(renderData) {
    return this.getFieldAndValue(renderData).value;
  }

  /**
   * @return {object} The undeflying value of the data type formatted for human consumption.
   */
  getDisplay(renderData) {
    const {field, value} = this.getFieldAndValue(renderData);
    return field
      ? field.getDisplay(value, renderData.options)
      : '';
  }

  /**
   * @return {DataType} The underlying data type.
   */
  getField(renderData) {
    return renderData.dataType.getField(this.getRef(), renderData.options);
  }

  /**
   * Returns the field and value of the underlying data type.
   * @return {object}
   */
  getFieldAndValue(renderData) {
    const {dataType, dataValue} = renderData;
    const {field, value} = dataType.getFieldAndValue(dataValue, this.getRef(), renderData.options);
    const defaultValueType = this.getDefaultValue();
    if (field && !field.hasValue(value) && defaultValueType) {
      const defaultValue = defaultValueType.getValue(renderData);
      return {
        field,
        value: defaultValue
      };
    }
    return {field, value};
  }

  /**
   * Filters the value by calling the underlying field's filter function. If
   * the field is not found, call the super's filter function instead.
   */
  filter(filterValue, rowValue, dataType) {
    const field = dataType.getField(this.getRef());
    if (!field) {
      return super.filter(filterValue, rowValue, row, dataType);
    }

    return field.filter(filterValue, rowValue);
  }
}


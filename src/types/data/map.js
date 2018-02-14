import {List, Map} from 'immutable';

import {parseRef} from '~/refs';

import DataType, {ImmutableDataType} from './';
import ValidationError from './validationError';

/**
 * The data type for maps of data.
 *
 * Allowed options:
 *
 * |Name|Type|Attribute|Description|
 * |----|----|---------|-----------|
 * |data|({@link Object} &vert; {@link DataType})[] | | A list of children data types. Its key in the map is the name of the child data type. If a data types is provided without a path, the path is assumed to be the name of the data type. |
 * |data.path| {@link string}[] | | Where to access the child data type. @see https://facebook.github.io/immutable-js/docs/#/Map/getIn |
 * |data.field| {@link DataType} | | The child data type. |
 *
 * @extends {ImmutableDataType}
 */
export default class ImmutableMapType extends ImmutableDataType {
  static typeName = 'map';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('data', data => data
        .map(fieldData => fieldData.get('type') ?
          Map({
            path: List([fieldData.get('name')]),
            field: parseField(fieldData)
          }) :
          fieldData
            .update('field', parseField)
        )
      );
  }

  initialize(value, renderOptions) {
    value = this.getValue(value);
    this.getData()
      .forEach(fieldData => {
        const field = fieldData.get('field');
        const path = fieldData.get('path');
        if (field.initialize) {
          field.initialize(value.getIn(path), renderOptions);
        }
      });
  }

  getDefaultValue() {
    return super.getDefaultValue(Map());
  }

  getData() {
    return this.options.get('data')
      .map(fieldData => fieldData instanceof DataType ?
        Map({
          path: List([fieldData.getName()]),
          field: fieldData
        }) :
        fieldData
      );
  }

  getDataNames() {
    return this.getData()
      .map(fieldData => fieldData.get('field').getName());
  }

  hasValue(model, checkDefault) {
    if (!super.hasValue(model, checkDefault)) {
      return false;
    }
    return this.getData()
      .map(fieldData => fieldData.get('field')
        .hasValue(model.getIn(fieldData.get('path'), checkDefault))
      )
      .reduce((modelHasValue, fieldHasValue) => modelHasValue || fieldHasValue);
  }

  getDisplay(model, renderOptions) {
    model = this.getValue(model);
    return this.getData()
      .map(fieldData => ({
        key: fieldData.get('field').getName(),
        value: model.getIn(fieldData.get('path'))
      }))
      .map(({key, value}) => `${key}: ${value}`)
      .join(', ');
  }

  getFieldData(ref) {
    return this.getData()
      .find(fieldData => fieldData.get('field').getName() == ref.ref);
  }

  getValue(model, ref, renderOptions) {
    model = model || this.getDefaultValue();
    if (ref) {
      return this.getFieldAndValue(model, ref, renderOptions).value;
    } else {
      return model
        .update(model => this.getData()
          .reduce(
            (model, fieldData) => {
              const field = fieldData.get('field');
              const path = fieldData.get('path');
              const value = field.getValue(model.getIn(path));
              return model.setIn(path, value);
            },
            model
          )
        );
    }
  }

  getField(refs, renderOptions) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return this;
    }

    const firstRef = refs.first();
    if (firstRef.ref === '') {
      return this.getNextField(this, refs.rest(), renderOptions);
    }

    const fieldData = this.getFieldData(firstRef);
    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }

    const field = fieldData.get('field');

    return this.getNextField(field, refs.rest(), renderOptions);
  }

  getFieldAndValue(model, refs, renderOptions) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return {};
    }

    if (!model) {
      return {field: this.getField(refs, renderOptions)};
    }

    const firstRef = refs.first();
    if (firstRef.ref === '') {
      return this.getNextFieldAndValue(this, model, refs.rest(), renderOptions);
    }

    const fieldData = this.getFieldData(firstRef);
    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }
    
    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const value = field.getValue(model.getIn(path));

    return this.getNextFieldAndValue(field, value, refs.rest(), renderOptions);
  }

  setValue(model, refs, newValue, renderOptions) {
    if (!model) {
      throw new Error('Invalid arguments to setDataValue: model = null');
    }

    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      throw new Error(`Invalid arguments to setDataValue: refs = ${refs}`);
    }

    const firstRef = refs.first();
    if (firstRef.ref === '') {
      return this.setNextValue(this, model, newValue, refs.rest(), renderOptions);
    }

    const fieldData = this.getFieldData(firstRef)
    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }

    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const oldValue = model.getIn(path);

    return model
      .setIn(path, this
        .setNextValue(field, oldValue, newValue, refs.rest(), renderOptions)
      );
  }

  validate(model) {
    return this.getData()
      .map(fieldData => {
        const field = fieldData.get('field');
        const ref = parseRef(field.getName());
        return this.validateSingle(model, ref);
      })
      .flatten(false)
      .filter(error => error)
      .map(error => {
        error.addRef(parseRef(error.field.getName()));
        error.field = this;
        return error;
      });
  }

  // TODO: Probably move this out of here and into some form validation / utils module.
  validateSingle(model, ref) {
    const {field, value} = this.getFieldAndValue(model, ref, {});

    return List([
      field.getValidationLinks()
        .map(linkRef => this.validateSingle(model, parseRef(linkRef)))
        .flatten(true)
        .filter(error => error),

      List([
        field.validate(value),
        field.getValidator()(value, model, field)
      ])
        .filter(error => error)
    ]).flatten(true);
  }

  exclude(model, deep=true) {
    model = super.exclude(model);
    return !model
      ? model
      : this.getData()
        .reduce((model, fieldData) => {
          const field = fieldData.get('field');
          const path = fieldData.get('path');
          return field.isExcluded()
            ? model.deleteIn(path)
            : model.updateIn(path, value => field.exclude(value))
        }, model);
  }
}


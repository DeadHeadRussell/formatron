import {List, Map} from 'immutable';

import {parseRef} from '~/refs';

import DataType, {ImmutableDataType} from './';
import ValidationError from './validationError';

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

  hasValue(model) {
    if (!super.hasValue(model)) {
      return false;
    }
    return this.getData()
      .map(fieldData => fieldData.get('field')
        .hasValue(model.getIn(fieldData.get('path')))
      )
      .reduce((modelHasValue, fieldHasValue) => modelHasValue || fieldHasValue);
  }

  getDisplay(model, ref) {
    model = model || this.getDefaultValue();
    if (ref) {
      const {field, value} = this.getFieldAndValue(model, ref);
      return field.getDisplay(value);
    } else {
      if (this.hasValue(model)) {
        return this.getData()
          .map(fieldData => ({
            key: fieldData.get('field').getName(),
            value: value.getIn(fieldData.get('path'))
          }))
          .map(({key, value}) => `${key}: ${value}`)
          .join(', ');
      }
      return '';
    }
  }

  getFieldData(ref) {
    return this.getData()
      .find(fieldData => fieldData.get('field').getName() == ref.ref);
  }

  getValue(model, ref) {
    model = model || this.getDefaultValue();
    if (ref) {
      return this.getFieldAndValue(model, ref).value;
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

  getField(refs) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return this;
    }

    const firstRef = refs.first();

    const fieldData = this.getFieldData(firstRef);

    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }

    const field = fieldData.get('field');

    return this.getNextField(field, refs.rest());
  }

  getFieldAndValue(model, refs) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return {};
    }

    if (!model) {
      return {field: this.getField(refs)};
    }

    const firstRef = refs.first();
    const fieldData = this.getFieldData(firstRef);

    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }
    
    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const value = field.getValue(model.getIn(path));

    return this.getNextFieldAndValue(field, value, refs.rest());
  }

  setValue(model, refs, newValue) {
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
    const fieldData = this.getFieldData(firstRef)

    if (!fieldData) {
      throw new Error(`Cannot find field for ref "${firstRef}" on "${this.getName()}": "${this.getDataNames()}"`);
    }

    const path = fieldData.get('path');
    const field = fieldData.get('field');
    const oldValue = model.getIn(path);

    return model
      .setIn(path, this
        .setNextValue(field, oldValue, newValue, refs.rest())
      );
  }

  validate(model) {
    return super.validate(model, () => {
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
    });
  }

  // TODO: Probably move this out of here and into some form validation / utils module.
  validateSingle(model, ref) {
    const {field, value} = this.getFieldAndValue(model, ref);

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
}


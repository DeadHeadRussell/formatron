import {List, Map} from 'immutable';

import {Types} from '~';

export default function createSchema(name, values) {
  return new Schema(name, values);
}

export function createListSchema(field, options) {
  return new ListSchema(field, options);
}

// TODO: Ugh, there's a few things going on here. Too much functionality in one
// place. This class is confusing model specific functions and generic form
// functionality and form traversal. The general schema class is really a class
// for Map like models and the list one is for, well, List like models.
//
// This causes issues, particularily with the List ref traversal. We cannot
// properly pass through lists at the moment since the traversal functions do
// not have access to the actually list of fields, so they are restricted to
// just handling the "query" style references. Also then, queries refs are
// restricted since they do not have access to the "path" values, so they are
// not query refs, they are simply dumb query keys (to the fields object).

// This class isn't really used. Its more of a reference of required functions
// for schema implementations. Since its this messy, it probably could use a
// rework.
class ISchema {
  getDataField() {
    throw new Error('Unimplemented');
  }

  getDataFieldAndValue() {
    throw new Error('Unimplemented');
  }

  setDataValue() {
    throw new Error('Unimplemented');
  }

  _getDataField(field, rest) {
    if (rest.size == 0) {
      return field;
    } else {
      if (field.getSchema) {
        const schema = field.getSchema();
        if (schema) {
          return schema.getDataField(ref.rest());
        }
        return null;
      } else {
        throw new Error(`Cannot reference "${field.name}" of data type "${field.type}"`);
      }
    }
  }

  getDataValue(model, ref) {
    const {field, value} = this.getDataFieldAndValue(model, ref);
    return value;
  }

  getDataLabel(model, ref) {
    const {field, value} = this.getDataFieldAndValue(model, ref);
    if (!field) {
      return;
    }

    return field.toString(value);
  }

  _getDataFieldAndValue(field, value, rest) {
    if (rest.size == 0) {
      return {field, value};
    } else {
      // Should this happen before the above if statement?
      if (field.getModel && field.getSchema) {
        const schema = field.getSchema();
        const nextModel = field.getModel(value);
        if (schema) {
          return schema.getDataFieldAndValue(nextModel, rest);
        }
        return {};
      } else {
        throw new Error(`Cannot reference "${field.name}" of data type "${field.type}"`);
      }
    }
  
    throw new Error('Unimplemented');
  }

  _setDataValue(model, field, path, value, first, rest) {
    if (rest.size == 0) {
      return model.setIn(path, value);
    } else {
      // (russell): This is not good, not good at all...
      if (field.type == Types.data.linked) {
        throw new Error('Cannot set value through a linked type reference');
      }

      if (field.getModel && field.getSchema) {
        const oldValue = this.getDataValue(model, first);
        const schema = field.getSchema();
        const nextModel = field.getModel(oldValue);
        return model.setIn(path, schema.setDataValue(nextModel, rest, value));
      } else {
        throw new Error(`Cannot reference "${field.name}" of data type "${field.type}"`);
      }
    }
  
  }
}

// TODO: Add caching to data and field getters based on id. Invalidate
// whenever the related model and any dependant models get updated.
//
// Caching is added below. No cache busting though.

class Schema extends ISchema {
  constructor(name, {displayName, data, form, table, label}) {
    super();
    this.getDataField = this.getDataField.bind(this);
    this.getDataValue = this.getDataValue.bind(this);
    this.getDataLabel = this.getDataLabel.bind(this);

    data.forEach(field => field.schema = this);

    this.name = name;
    this.displayName = displayName || name;
    this.data = List(data);
    this.form = form;
    this.table = List(table);
    this.label = label;
    
    this.labelsCache = Map();
  }

  createGetters(model, otherGetters = {}) {
    return {
      getName: () => this.name,
      getModel: () => model,
      getDataField: this.getDataField,
      getDataValue: ref => this.getDataValue(model, ref),
      getDataLabel: ref => this.getDataLabel(model, ref),
      getDataFieldAndValue: ref => this.getDataFieldAndValue(model, ref),
      ...otherGetters
    };
  }

  renderForm(model, formGetters, callbacks) {
    const getters = this.createGetters(model, formGetters);
    return <this.form.Component getters={getters} callbacks={callbacks} />;
  }

  resolveChanges(model, changes, defaultValues, disabledValues) {
    const getDefaultValue = ref => {
      const {field, value} = this.getDataFieldAndValue(model, ref);
      const values = field.options.get('generated') ?
        [
          value
        ] :
        [
          value,
          defaultValues.get(ref),
          field.options.get('defaultValue'),
          field.getDefaultValue()
        ];
      return values.find(value => typeof value != 'undefined');
    };

    return model
      .update(model => this.data
        .reduce(
          (model, field) => {
            const name = field.name;
            const defaultValue = getDefaultValue(name);
            return model.setIn(field.path.push(name), defaultValue);
          },
          model
        )
      )
      .update(model => changes
        .reduce(
          (model, value, ref) => this.setDataValue(model, ref, value),
          model
        )
      )
      .update(model => disabledValues
        .reduce(
          (model, value, ref) => {
            if (typeof value != 'undefined') {
              return this.setDataValue(model, ref, value);
            }
            return model
          },
          model
        )
      );
  }

  validate(model) {
    return this.data
      .map(field => field.name)
      .map(ref => this.validateSingle(model, ref))
      .flatten(true);
  }

  validateSingle(model, ref) {
    const {field, value} = this.getDataFieldAndValue(model, ref);

    if (!field) {
      return {
        ref,
        value: `Could not find a field for "${ref}"`
      };
    }

    return List([
      field.options.get('validationLinks', List())
        .map(linkRef => this.validateSingle(model, linkRef))
        .filter(value => value)
        .flatten(true),

      field.options.get('validations', Map())
        .map(validator => validator(value, model))
        .filterNot(validated => validated)
        .map((validated, validatorName) => ({
          ref,
          value: field.options.getIn(['validationErrors', validatorName])
        }))
        .toList(),

      List([field.validate(value)])
        .filter(errorMessage => errorMessage)
        .map(errorMessage => ({
          ref,
          value: errorMessage
        }))
    ]).flatten(true);
  }

  getColumns() {
    return this.table.map((column, i) => ({
      id: '' + i,
      label: column.getHeaderCell()
    }));
  }

  getRow(model) {
    return this.table
      .toMap()
      .mapEntries(([i, column]) => [
        '' + i,
        column.getRowCell(this.createGetters(model))
      ])
      .set('id', model.get('id'));
  }

  getRows(table) {
    return table.map(row => this.table
      .map(column => column
        .getRowCell(this.createGetters(row))
      )
      .unshift(row.get('id'))
    );
  }

  getLabel(model) {
    if (!model) {
      return '';
    }

    if (!this.labelsCache.get(model.get('id'))) {
      this.labelsCache = this.labelsCache
        .set(model.get('id'), this.label.render(this.getDataLabel.bind(this, model)));
    }
    return this.labelsCache.get(model.get('id'));
  }

  setDataValue(model, ref, value) {
    if (!model) {
      throw new Error('Invalid arguments to setDataValue: null model');
    }
   
    if (!ref || (List.isList(ref) && ref.size == 0)) {
      throw new Error(`Invalid arguments to setDataValue: ${model.get('id')} ${ref.toJS()}`);
    }

    if (typeof ref == 'string') {
      ref = List([ref]);
    }

    const field = this.data.find(field => field.name == ref.first());
    const path = field.path.push(field.name);
    return this._setDataValue(model, field, path, value, ref.first(), ref.rest());
  }

  getDataFieldAndValue(model, ref) {
    if (!ref || (List.isList(ref) && ref.size == 0)) {
      return {};
    }

    if (!model) {
      return {field: this.getDataField(ref)};
    }

    if (typeof ref == 'string') {
      ref = List([ref]);
    }

    const field = this.data.find(field => field.name == ref.first());
    const value = model.getIn(field.path.push(field.name));
    return this._getDataFieldAndValue(field, value, ref.rest());
  }

  getDataField(ref) {
    if (!ref || (List.isList(ref) && ref.size == 0)) {
      return null;
    }

    if (typeof ref == 'string') {
      ref = List([ref]);
    }

    const field = this.data.find(field => field.name == ref.first());
    return this._getDataField(field, ref.rest());
  }
}

// This class does not allow indexing through a list. The list must currently
// be the last part of the ref list.
class ListSchema extends ISchema {
  constructor(options) {
    super();
    this.options = options;
  }

  getDataFieldAndValue(list, ref) {
    if (!ref || (List.isList(ref) && ref.size == 0)) {
      return {};
    }

    if (!list || !List.isList(list)) {
      return {field: this.getDataField(ref)};
    }

    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    const listRef = ref.first();
    if (!this.isValidListRef(listRef)) {
      throw new Error(`Invalid list ref of "${listRef}"`);
    }

    const value = this.getListRefValue(list, listRef);
    const field = this.getListRefField(listRef);

    return this._getDataFieldAndValue(field, value, ref.rest());
  }

  getDataField(ref) {
    if (!ref || (List.isList(ref) && ref.size == 0)) {
      return null;
    }
    
    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    const listRef = ref.first();
    if (!this.isValidListRef(listRef)) {
      throw new Error(`Invalid list ref of "${listRef}"`);
    }

    const field = this.getListRefField(listRef);
    return this._getDataField(field, ref.rest());
  }

  setDataValue(list, ref, value) {
    if (!List.isList(list)) {
      throw new Error(`Cannot set value of a non-list (${list})`);
    }

    if (!ref || (List.isList(ref) && ref.size == 0)) {
      throw new Error(`Invalid ref to set value in list "${ref}"`);
    }

    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    const listRef = ref.first();
    if (!this.isValidListRef(listRef)) {
      throw new Error(`Invalid list ref of ${listRef}`);
    }

    if (!this.isSingularListRef(listRef)) {
      throw new Error('Setting data values for multiple list values at a time is not yet supported');
    }

    const field = this.getListRefField(listRef);
    const index = this.getListRefIndex(list, listRef);
    if (index < 0) {
      throw new Error(`Attempt to set an invalid index in a list (ref=${ref})`);
    }
    return this._setDataValue(model, field, path, value, ref.first(), ref.rest());
  }

  isValidListRef(refValue) {
    if (Number.isInteger(refValue)) {
      return true;
    }

    if (typeof refValue != 'string') {
      return false;
    }

    if (refValue.indexOf(':') != 1) {
      return false;
    }

    const fn = refValue[0];
    return ['f', 'a', 'q', 'm'].includes(fn);
  }

  isSingularListRef(listRef) {
    return Number.isInteger(listRef) || listRef[0] == 'q';
  }

  isMapListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'm';
  }

  getListRefValue(list, listRef) {
    if (Number.isInteger(listRef)) {
      return list.get(listRef);
    }

    const field = this.options.get('listField');
    const schema = field.getSchema && field.getSchema();

    switch (listRef[0]) {
      case 'f': {
        const [ref, value] = schema ?
          listRef.slice(2).split('=') :
          [null, listRef.slice(2)];

        return list.filter(ref ?
          this.refTester(field, schema, ref, value) :
          this.valueTester(value)
        );
      }

      case 'q': {
        const [ref, value] = schema ?
          listRef.slice(2).split('=') :
          [null, listRef.slice(2)];

        return list.find(ref ?
            this.refTester(field, schema, ref, value) :
            this.valueTester(value)
          );
      }

      case 'm': {
        const ref = listRef.slice(2);
        return list.map(value => {
          const schema = field.getSchema();
          const model = field.getModel(value);
          return schema.getDataValue(model, ref);
        });
      }

      case 'a':
        return list;
    }
  }

  refTester(field, schema, ref, value) {
    return listValue => {
      const model = field.getModel(listValue);
      return schema.getDataValue(model, ref) == value;
    };
  }

  valueTester(value) {
    return listValue => listValue == value;
  }

  getListRefIndex(list, listRef) {
    if (Number.isInteger(listRef)) {
      return listRef;
    }

    if (listRef[0] == 'q') {
      const field = this.options.get('listField');
      const schema = field.getSchema && field.getSchema();
      const [ref, value] = schema ?
        listRef.slice(2).split('=') :
        [null, listRef.slice(2)];

      return list.findIndex(ref ?
        this.refTester(field, schema, ref, value) :
        this.valueTester(value)
      );
    }
    return -1;
  }

  getListRefField(listRef) {
    if (this.isSingularListRef(listRef)) {
      return this.options.get('listField');
    } else if (this.isMapListRef(listRef)) {
      const [mapRef] = listRef.slice(2).split('=');

      const field = this.options.get('listField');
      const schema = field.getSchema();
      const mappedField = schema.getDataField(mapRef);

      return Types.data.list.create('mappedList', {
        listType: mappedField.type.name,
        listOptions: mappedField.options
      });
    } else {
      return Types.data.list.create('selfList', this.options);
    }
  }
}


import {List, Map} from 'immutable';

import {Types} from '~';

export default function createSchema(name, values) {
  return new Schema(name, values);
}

export function createListSchema(typeName, listField, options) {
  return new ListSchema(typeName, listField, options);
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
// (update) it is now used, but this is still a bad setup.
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
          return schema.getDataField(rest);
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
        if (!field.hasValue(value)) {
          value = field.getDefaultValue();
        }
        const nextModel = field.getModel(value);
        const schema = field.getSchema(nextModel);
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
      // XXX: (russell) This is not good, not good at all...
      if (field.type == Types.data.linked) {
        throw new Error('Cannot set value through a linked type reference');
      }

      if (field.getModel && field.getSchema) {
        const oldValue = this.getDataValue(model, first);
        const nextModel = field.getModel(oldValue);
        const schema = field.getSchema(nextModel);
        return model.setIn(path, schema.setDataValue(nextModel, rest, value));
      } else {
        throw new Error(`Cannot reference "${field.name}" of data type "${field.type}"`);
      }
    }
  
  }
}

class Schema extends ISchema {
  constructor(name, {displayName, data, form, table, label}) {
    super();
    this.getDataField = this.getDataField.bind(this);
    this.getDataValue = this.getDataValue.bind(this);
    this.getDataLabel = this.getDataLabel.bind(this);

    // TODO: This probably shouldn't be done...
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
      getSize: () => 'normal',
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
    // TODO: This is dumb.
    return this.table
      .map(column => ({
        get label() {
          if (column.typeName == 'button') {
            return '';
          }
          return column.label;
        },

        get key() {
          return column.label;
        },

        getSizing: () => {
          const sizing = column.getTableSizing();
          return sizing || {
            width: 100,
            grow: 1,
            shrink: 1
          };
        },

        getCell: (row, options) => {
          return column.getDisplay(this.createGetters(row, {
            prefersQuick() {
              return options.preferQuick
            }
          }));
        },

        getEditableCell: (row, options, callbacks) => {
          return <column.Component
            getters={this.createGetters(row, {
              getChange() {
                return null;
              },
              getError() {
                return null;
              },
              getDisabled() {
                return false;
              },
              getSize() {
                return 'small';
              },
              prefersQuick() {
                return options.preferQuick
              }
            })}
            callbacks={callbacks}
          />;
        }
      }));
  }

  getColumnsOld() {
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
    // TODO: Either remove this cache from the library and add in a way for the
    // users to handle the caching, or provide cache busting methods.
    if (!model) {
      return '';
    }

    if (!this.labelsCache.get(model.get('id'))) {
      this.labelsCache = this.labelsCache
        .set(model.get('id'), this.label.getValue(this.createGetters(model)));
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
    if (!field) {
      throw new Error(`Could not find field to set a value for ref "${ref.first()}" on "${model}"`);
    }
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
    if (!field) {
      throw new Error(`Could not find field to get a value for ref "${ref.first()}" on "${model}"`);
    }
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

class ListSchema extends ISchema {
  constructor(typeName, listField, options) {
    super();
    this.typeName = typeName;
    this.listField = listField;
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

    // TODO: Maybe move this to its own functions? Or try to simplify the state logic?
    if (this.isQueryListRef(listRef)) {
      if (ref.size == 1) {
        if (index >= 0) {
          if (!value) {
            return list.remove(index);
          } else {
            return list.set(index, value);
          }
        } else {
          if (typeof value != 'undefined' && value !== null) {
            return list.push(value);
          } else if (!value) {
            return list;
          }
        }
      } else {
        if (index >= 0) {
          return this._setDataValue(list, field, path, value, ref.first(), ref.rest());
        } else {
          throw new Error(`Attempt to set an invalid index in a list (ref=${ref})`);
        }
      }
    } else {
      return this._setDataValue(list, field, path, value, ref.first(), ref.rest());
    }
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
    return ['f', 'a', 'q', 'm', 'l'].includes(fn);
  }

  isSingularListRef(listRef) {
    return this.isIndexListRef(listRef) || this.isQueryListRef(listRef);
  }

  isMultiListRef(listRef) {
    return this.isFilterListRef(listRef) ||
      this.isMapListRef(listRef) ||
      this.isLabelListRef(listRef) ||
      this.isAllListRef(listRef);
  }

  isIndexListRef(listRef) {
    return Number.isInteger(listRef);
  }

  isQueryListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'q';
  }

  isFilterListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'f';
  }

  isMapListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'm';
  }

  isLabelListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'l';
  }

  isAllListRef(listRef) {
    return typeof listRef == 'string' && listRef[0] == 'a';
  }

  getListRefValue(list, listRef) {
    if (Number.isInteger(listRef)) {
      return list.get(listRef);
    }

    switch (listRef[0]) {
      case 'f': {
        const [ref, value] = listRef.includes('=') ?
          listRef.slice(2).split('=') :
          [null, listRef.slice(2)];

        return list.filter(ref ?
          this.refTester(this.listField, ref, value) :
          this.valueTester(value)
        );
      }

      case 'q': {
        const [ref, value] = listRef.includes('=') ?
          listRef.slice(2).split('=') :
          [null, listRef.slice(2)];

        return list.find(ref ?
          this.refTester(this.listField, ref, value) :
          this.valueTester(value)
        );
      }

      case 'm': {
        const ref = listRef.slice(2);
        return list.map(value => {
          const model = this.listField.getModel(value);
          const schema = this.listField.getSchema(model);
          return schema.getDataValue(model, ref);
        });
      }

      case 'l': {
        return list.map(value => {
          const model = this.listField.getModel(value);
          const schema = this.listField.getSchema(model);
          return schema.getLabel(model);
        });
      }

      case 'a':
        return list;
    }
  }

  refTester(field, ref, value) {
    return listValue => {
      const model = field.getModel(listValue);
      const schema = field.getSchema(model);
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
      const schema = this.listField.getSchema && this.listField.getSchema();
      const [ref, value] = schema ?
        listRef.slice(2).split('=') :
        [null, listRef.slice(2)];

      return list.findIndex(ref ?
        this.refTester(this.listField, schema, ref, value) :
        this.valueTester(value)
      );
    }
    return -1;
  }

  getListRefField(listRef) {
    if (this.isSingularListRef(listRef)) {
      const listFilters = this.options.get('filters', List());
      const refFilter = this.isQueryListRef(listRef) ?
        listRef.slice(2) :
        null;

      const filters = refFilter ?
        listFilters.push(refFilter) :
        listFilters;

      return this.listField.type.create(
        this.listField.name,
        this.listField.options
          .set('filters', filters),
        this.listField.path
      );
    } else if (this.isMapListRef(listRef)) {
      const [mapRef] = listRef.slice(2).split('=');

      const schema = this.listField.getSchema();
      const mappedField = schema.getDataField(mapRef);

      return Types.data.list.create('mappedList', {
        listType: mappedField.type.name,
        listOptions: mappedField.options
      });
    } else if (this.isFilterListRef(listRef)) {
      const refFilter = listRef.slice(2);
      return Types.data[this.typeName].create('filteredList', this.options
        .update('filters', List(), filters => filters.push(refFilter))
      );
    } else {
      return Types.data[this.typeName].create('selfList', this.options);
    }
  }
}


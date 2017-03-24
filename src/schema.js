import {List, Map} from 'immutable';

export default function createSchema(name, values) {
  return new Schema(name, values);
}

export function createListSchema(options) {
  return new ListSchema(options);
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

  getDataValue() {
    throw new Error('Unimplemented');
  }

  getDataLabel() {
    throw new Error('Unimplemented');
  }

  getDataFieldAndValue() {
    throw new Error('Unimplemented');
  }

  setDataValue() {
    throw new Error('Unimplemented');
  }
}

// TODO: Add caching to data and field getters based on id. Invalidate
// whenever the related model and any dependant models get updated.
//
// Caching is added below. No cache busting though.

class Schema {
  constructor(name, {data, form, table, label}) {
    this.getDataField = this.getDataField.bind(this);
    this.getDataValue = this.getDataValue.bind(this);
    this.getDataLabel = this.getDataLabel.bind(this);

    data.forEach(field => field.schema = this);

    this.name = name;
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
          value,
          field.generateValue()
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
          (model, value, ref) => this.setDataValue(model, ref, value),
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

  setDataValue(model, ref, value) {
    if (!model || !ref || (List.isList(ref) && ref.size == 0)) {
      throw new Error(`Invalid arguments to setDataValue: ${model.get('id')} ${ref.toJS()}`);
    }

    if (typeof ref == 'string') {
      ref = List([ref]);
    }

    const field = this.data.find(field => field.name == ref.first());
    const path = field.path.push(field.name);

    const rest = ref.rest();

    if (rest.size == 0) {
      return model.setIn(path, value);
    } else {
      if (field.type == 'linked') {
        throw new Error('Cannot set value through a linked type reference');
      }

      if (field.getModel && field.getSchema) {
        const oldValue = this.getDataValue(model, ref.first());
        const nextModel = field.getModel(oldValue);
        const schema = field.getSchema(nextModel);
        return model.setIn(path, schema.setDataValue(nextModel, ref.rest(), value));
      } else {
        throw new Error(`Cannot reference "${field.name}" of data type "${field.type}"`);
      }
    }
  }

  getDataFieldAndValue(model, ref) {
    if (!model || !ref || (List.isList(ref) && ref.size == 0)) {
      return {};
    }

    if (typeof ref == 'string') {
      ref = List([ref]);
    }

    const first = ref.first();

    const field = this.data.find(field => field.name == first);

    const path = field.path.push(field.name);
    const value = model.getIn(path);

    const rest = ref.rest();

    if (rest.size == 0) {
      return {field, value};
    } else {
      if (field.getModel && field.getSchema) {
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
  }

  getDataField(ref) {
    if (List.isList(ref) && ref.size == 1) {
      ref = ref.get(0);
    }

    if (typeof ref == 'string') {
      return this.data.find(field => field.name == ref);
    } else if (List.isList(ref)) {
      const field = this.getDataField(ref.first());
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
}

// This class does not allow indexing through a list. The list must currently
// be the last part of the ref list.
class ListSchema {
  constructor(options) {
    this.options = options;
  }

  getDataFieldAndValue(list, ref) {
    const refStr = ref.first();
    if (refStr.indexOf('q:') != 0) {
      throw new Error('Invalid list ref: ' + refStr);
    }

    const listField = this.options.get('listField');

    if (!list) {
      return {
        field: listField,
        value: null
      };
    }

    const [key, value] = refStr.slice(2).split('=');
    const model = list.find(model => model.getIn(['fields', key]) == value);

    return {
      field: listField,
      value: model && model.get('id')
    };
  }

  getDataValue(list, ref) {
    const {field, value} = getDataFieldAndValue(list, ref);
    return value;
  }

  getDataLabel(list, ref) {
    const {field, value} = getDataFieldAndValue(list, ref);
    if (!field) {
      return;
    }
    return field.toString(value);
  }

  getDataField(ref) {
    const refStr = ref.first();
    if (refStr.indexOf('q:') != 0) {
      throw new Error('Invalid list ref: ' + refStr);
    }
    
    return field.options.get('listField');
  }

  setDataValue(list, ref, value) {
    if (!list) {
      throw new Error('Cannot set value of a null list');
    }

    const refStr = ref.first();
    if (refStr.indexOf('q:') != 0) {
      throw new Error('Invalid list ref: ' + refStr);
    }

    const [key, search] = refStr.slice(2).split('=');
    const index = list.findIndex(model => model.getIn(['fields', key]) == search);
    return list.set(index, value);
  }
}


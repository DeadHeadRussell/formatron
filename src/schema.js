import {List, Map} from 'immutable';

import {Types} from '~';

{
  resolveChanges(model, changes, defaultValues, disabledValues) {
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
    if (!model) {
      return '';
    }

    if (!this.labelsCache.get(model.get('id'))) {
      this.labelsCache = this.labelsCache
        .set(model.get('id'), this.label.getDisplay(this.createGetters(model)));
    }
    return this.labelsCache.get(model.get('id'));
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


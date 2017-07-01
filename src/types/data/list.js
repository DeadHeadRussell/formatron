import {List} from 'immutable';

import DataViewType from '~/types/view/data';

import DataType, {ImmutableDataType} from './';
import ValidationError from './validationError';

export default class ImmutableListType extends ImmutableDataType {
  static typeName = 'list';

  static parseOptions(field, parseField) {
    return field
      .update('itemType', parseField);
  }

  getItemType() {
    return this.options.get('itemType');
  }

  hasValue(value) {
    if (!super.hasValue(value)) {
      return false;
    }
    return value && value.size > 0;
  }

  getDefaultValue() {
    return super.getDefaultValue(List());
  }

  getFieldFromRef(ref) {
    if (ref.isSingleRef()) {
      return this.getItemType();
    } else if (ref.isMapper()) {
      const itemType = this.getItemType();
      const newItemType = ref.view instanceof DataViewType ?
        ref.view.getFieldAndValue(new RenderData(itemType, null)).field :
        new DataType('mappedListItem', Map());

      return new this.constructor(`mappedList(${this.getName()})`, this.options
        .set('itemType', newItemType)
      );
    } else if (ref.isFilterer()) {
      return new this.constructor(`filteredList(${this.getName()})`, this.options);
    } else {
      return this;
    }
  }

  getField(refs) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return null;
    }

    const field = this.getFieldFromRef(refs.first());
    this.getNextField(field, refs.rest());
  }

  getFieldAndValue(list, ref) {
    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    if (ref.size == 0) {
      return {};
    }

    if (!list || !List.isList(list)) {
      return {field: this.getField(ref)};
    }

    const firstRef = ref.first();
    const value = firstRef.getValue(this, list);
    const field = this.getFieldFromRef(firstRef);

    return this.getNextFieldAndValue(field, value, ref.rest());
  }

  setValue(list, ref, newValue) {
    if (!List.isList(list)) {
      throw new Error(`Cannot set value of a non-list (${list})`);
    }

    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    if (ref.size == 0) {
      throw new Error(`Invalid ref to set value in list "${ref}"`);
    }

    const firstRef = ref.first();

    const field = this.getFieldFromRef(firstRef);
    const oldValue = firstRef.getValue(this, list);

    return firstRef.setValue(this, list, this.setNextValue(
      field, oldValue, newValue, refs.rest()
    ));
  }

  validate(list) {
    return super.validate(list, () => {
      const itemType = this.getItemType();
      return list
        .map((item, index) => [
          index,
          itemType.validate(item)
        ])
        .filter(([index, error]) => error)
        .map(([index, error]) => {
          error.addRef(index);
          error.field = this;
          return error;
        });
    });
  }
}


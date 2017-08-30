import {List} from 'immutable';

import RenderData from '~/renderers/renderData';
import DataViewType from '~/types/view/data';

import DataType, {ImmutableDataType} from './';
import ValidationError from './validationError';

export default class ImmutableListType extends ImmutableDataType {
  static typeName = 'list';

  static parseOptions(field, parseField) {
    return super.parseOptions(field)
      .update('itemType', parseField);
  }

  isOfType(value) {
    return List.isList(value);
  }

  getItemType() {
    return this.options.get('itemType');
  }

  hasValue(value, checkDefault) {
    if (!super.hasValue(value, checkDefault)) {
      return false;
    }
    return value && value.size > 0;
  }

  getDefaultValue() {
    return super.getDefaultValue(List());
  }

  getDisplay(value) {
    if (this.hasValue(value)) {
      const itemType = this.getItemType();
      return value
        .map(item => itemType.getDisplay(item))
        .join(', ');
    }
    return '';
  }

  getFieldFromRef(ref) {
    if (ref.isSingleRef()) {
      return this.getItemType();
    } else if (ref.isMapper()) {
      const itemType = this.getItemType();
      const newItemType = ref.view instanceof DataViewType ?
        ref.view.getFieldAndValue(new RenderData(itemType, null)).field :
        new DataType(`mapped${this.constructor.name}Item`, Map());

      return new this.constructor(`mapped${this.constructor.name}(${this.getName()})`, this.options
        .set('itemType', newItemType)
      );
    } else if (ref.isFilterer()) {
      return new this.constructor(`filtered${this.constructor.name}(${this.getName()})`, this.options);
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
    return this.getNextField(field, refs.rest());
  }

  getFieldAndValue(list, ref) {
    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    if (ref.size == 0) {
      return {};
    }

    if (!list || !this.isOfType(list)) {
      return {field: this.getField(ref)};
    }

    const firstRef = ref.first();
    const value = firstRef.getValue(this, list);
    const field = this.getFieldFromRef(firstRef);

    return this.getNextFieldAndValue(field, value, ref.rest());
  }

  setValue(list, ref, newValue) {
    list = this.getValue(list);

    if (!this.isOfType(list)) {
      throw new Error(`Cannot set value of a non-${this.constructor.name} (${list})`);
    }

    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    if (ref.size == 0) {
      throw new Error(`Invalid ref to set value in ${this.constructor.name} "${ref}"`);
    }

    const firstRef = ref.first();

    const field = this.getFieldFromRef(firstRef);
    const oldValue = firstRef.getValue(this, list);

    return firstRef.setValue(this, list, this.setNextValue(
      field, oldValue, newValue, ref.rest()
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
        .filter(([index, error]) => error && (!List.isList(error) || error.size > 0))
        .map(([index, error]) => {
          error.addRef(index);
          error.field = this;
          return error;
        });
    });
  }
}


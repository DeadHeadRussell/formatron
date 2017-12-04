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

  initialize(value, renderOptions) {
    const field = this.getItemType();
    if (field.initialize) {
      this.getValue(value)
        .forEach(item => field.initialize(item, renderOptions));
    }
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

  getDisplay(value, renderOptions) {
    if (this.hasValue(value)) {
      const itemType = this.getItemType();
      return value
        .map(item => itemType.getDisplay(item, renderOptions))
        .join(', ');
    }
    return '';
  }

  getFieldFromRef(ref, renderOptions) {
    if (ref.isListRef() && ref.isFinder()) {
      const itemType = this.getItemType();
      return new itemType.constructor(`found${itemType.constructor.name}(${itemType.getName()})`, itemType.options
        .update('filters', (filters = List()) => filters.push(ref))
      );
    } else if (ref.isSingleRef()) {
      return this.getItemType();
    } else if (ref.isMapper()) {
      const itemType = this.getItemType();
      const newItemType = ref.view instanceof DataViewType ?
        ref.view.getField(new RenderData(itemType, null, renderOptions)) :
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

  getField(refs, renderOptions) {
    if (!List.isList(refs)) {
      refs = List([refs]);
    }

    if (refs.size == 0) {
      return null;
    }

    const field = this.getFieldFromRef(refs.first(), renderOptions);
    return this.getNextField(field, refs.rest(), renderOptions);
  }

  getFieldAndValue(list, ref, renderOptions) {
    if (!List.isList(ref)) {
      ref = List([ref]);
    }

    if (ref.size == 0) {
      return {};
    }

    if (!list || !this.isOfType(list)) {
      return {field: this.getField(ref, renderOptions)};
    }

    const firstRef = ref.first();
    const value = firstRef.getValue(this, list, renderOptions);
    const field = this.getFieldFromRef(firstRef, renderOptions);

    return this.getNextFieldAndValue(field, value, ref.rest(), renderOptions);
  }

  setValue(list, ref, newValue, renderOptions) {
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

    const field = this.getFieldFromRef(firstRef, renderOptions);
    const oldValue = firstRef.getValue(this, list, renderOptions);

    return firstRef.setValue(this, list, this.setNextValue(
      field, oldValue, newValue, ref.rest(), renderOptions
    ), renderOptions);
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


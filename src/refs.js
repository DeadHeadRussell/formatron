import {valueRenderers} from '~/renderers';
import {RenderData} from '~/renderers/renderData.js';

export function parseRef(field) {
  if (typeof field == 'string') {
    return new ImmutableRef(field);
  }

  switch (field.get('type')) {
    case 'value':
      return new ImmutableRef(field.get('value'));

    case 'list':
      const refValue = field.get('value');
      switch (refValue.get('type')) {
        case 'find': 
          return new ListFindRef(refValue.get('finder'));

        case 'filter':
          return new ListFilterRef(refValue.get('filter'));

        case 'map':
          return new ListMapRef(refValue.get('mapper'));

        default:
          throw new Error(`Unknown list ref type "${refValue.get('type')}"`);
      }

    default:
      throw new Error(`Unknown ref type "${field.get('type')}"`);
  }
}

export class Ref {
  getValue() {
    throw new Error('Abstract function');
  }

  getDisplay() {
    throw new Error('go away');
  }

  toString() {
    return this.getDisplay();
  }
}

export class ImmutableRef extends Ref {
  constructor(ref) {
    super();
    this.ref = ref;
  }

  isListRef() {
    return false;
  }

  isSingleRef() {
    return true;
  }

  isMultiRef() {
    return !this.isSingleRef();
  }

  getValue(dataType, dataValue) {
    if (!dataValue) {
      return null;
    }

    if (!this.ref) {
      return dataValue;
    }

    return dataValue.get(this.ref);
  }

  setValue(dataType, dataValue, childValue) {
    if (!dataValue) {
      throw new Error(`Cannot set value for on a null object: (with ${this.getDisplay})`);
    }

    if (!this.ref) {
      return dataValue;
    }

    return dataValue.set(this.ref, childValue);
  }

  getDisplay() {
    return this.ref;
  }
}

export class ImmutableListRef extends ImmutableRef {
  constructor(view) {
    super();
    this.view = view;
  }

  isListRef() {
    return true;
  }

  isFilterer() {
    return false;
  }

  isMapper() {
    return false;
  }

  checkValidData(dataType, dataValue) {
    if (!dataType instanceof ImmutableListType) {
      throw new Error(`Cannot reference a list with a non-list based data type "${dataType}"`);
    }

    if (!dataValue || !List.isList(dataValue)) {
      throw new Error(`Cannot reference a non-list with a list ref of ${this.view}`);
    }
  }

  getDisplay() {
    return this.view.getLabel();
  }

  getValue(listType, list) {
    this.checkValidData(listType, list);
    
    if (!this.constructor.method) {
      return list;
    }

    const itemType = listType.getItemType();
    return list
      [this.constructor.method](item => {
        const renderData = new RenderData(itemType, item);
        return valueRenderers.getValue(this.view, renderData);
      });
  }

  setValue(listType, list, newItem) {
    if (List.isList(newItem)) {
      console.warn('Setting each list item to be a list. This may be due to using multiple list refs which is currently unimplemented');
    }

    return list.map(() => newItem);
  }
}

export class ImmutableListFindRef extends ImmutableListRef {
  static method = 'find';

  setValue(listType, list, newItem) {
    const index = list
      .findIndex(item => {
        const renderData = new RenderData(itemType, item);
        return valueRenderers.getValue(this.view, renderData);
      });

    if (index >= 0) {
      return list.set(index, newItem);
    } else {
      return list.push(newItem);
    }
  }
}

export class ImmutableListFilterRef extends ImmutableListRef {
  static method = 'filter'

  isSingleRef() {
    return false;
  }

  isFilterer() {
    return true;
  }

  setValue(listType, list, newItem) {
    if (List.isList(newItem)) {
      console.warn('Setting each list item to be a list. This may be due to using multiple list refs which is currently unimplemented');
    }

    const indexes = list
      .map((item, index) => [
        index,
        item
      ])
      .filter(([index, item]) => {
        const renderData = new RenderData(itemType, item);
        return valueRenderers.getValue(this.view, renderData);
      })
      .map(([index, item]) => index);

    return list
      .map((item, index) => indexes.includes(index) ?
        newItem :
        index
      );
  }
}

export class ImmutableListMapRef extends ImmutableListRef {
  static method = 'map'

  isSingleRef() {
    return false;
  }

  isMapper() {
    return true;
  }

  setValue(listType, list, newItem) {
    throw new Error('Not yet implemented');
  }
}


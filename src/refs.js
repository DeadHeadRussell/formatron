import {RenderData} from '~/renderers/renderData.js';

export function parseRef(field) {
  switch (field.get('type')) {
    case 'value':
      return Ref(field.get('value'));

    case 'list':
      const refValue = field.get('value');
      switch (refValue.get('type')) {
        case 'find': 
          return ListFindRef(refValue.get('finder'));

        case 'filter':
          return ListFilterRef(refValue.get('filter'));

        case 'map':
          return ListMapRef(refValue.get('mapper'));

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
}

export class ImmutableRef extends Ref {
  constructor(ref) {
    super();
    this.ref = ref;
  }

  isListRef() {
    return false;
  }

  getValue(dataType, model) {
    if (!model) {
      return undefined;
    }

    if (this.ref == '') {
      return model;
    }

    if (Immutable.isImmutable(model)) {
      return dataType.getValue(model.get(this.ref));
    }

    throw new Error(`Cannot reference a non-immutable value with ${this.ref}`);
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

  isSingleRef() {
    return true;
  }

  isMultiRef() {
    return !this.isSingleRef();
  }

  checkValidData(dataType, dataValue) {
    if (!dataType instanceof ImmutableListType) {
      throw new Error(`Cannot reference a list with a non-list based data type "${dataType}"`);
    }

    if (!dataValue || !List.isList(dataValue)) {
      throw new Error(`Cannot reference a non-list with a list ref of ${this.view}`);
    }
  }

  getValue(dataType, list) {
    this.checkValidData(dataType, list);

    const listType = dataType.getListType();
    return list[this.constructor.method](model => {
      const renderData = new RenderData(listType, model, {});
      return this.view.getValue(renderData);
    });
  }
}

export class ImmutableListFindRef extends ImmutableListRef {
  static method = 'find'
}

export class ImmutableListFilterRef extends ImmutableListRef {
  static method = 'filter'

  isSingleRef() {
    return false;
  }
}

export class ImmutableListMapRef extends ImmutableListRef {
  static method = 'map'

  isSingleRef() {
    return false;
  }
}


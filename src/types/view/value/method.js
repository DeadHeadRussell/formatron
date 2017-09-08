import {List} from 'immutable';

import {valueRenderers} from '~/renderers';

import ValueType from './';

export default class MethodType extends ValueType {
  static typeName = 'method';

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('obj', parseField)
      .update('args', List(), this.parseOneOrMany(parseField));
  }

  initialize(renderData) {
    super.initialize(renderData, this.getArgs());
    super.initialize(renderData, this.getObj());
  }

  getObj() {
    return this.options.get('obj');
  }

  getMethod() {
    return this.options.get('method');
  }

  getArgs() {
    return this.options.get('args');
  }

  getValue(renderData) {
    const obj = valueRenderers.getValue(this.getObj(), renderData);
    if (!obj) {
      return null;
    }

    const values = this.getChildValues(renderData, this.getArgs());
    return obj[this.getMethod()](...values.toArray());
  }
}


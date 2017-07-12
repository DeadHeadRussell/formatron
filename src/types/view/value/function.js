import {List} from 'immutable';

import {numericalDisplay, textDisplay} from '../utils';

import ValueType from './';

export default class FunctionType extends ValueType {
  static typeName = 'function';

  static fns = {
    ceil: value => Math.ceil(value),
    floor: value => Math.floor(value),
    round: value => Math.round(value),
    formatDate: (value, format) => new Date(value * 1000).format(format)
  };

  static fnDisplays = {
    ceil: numericalDisplay,
    floor: numericalDisplay,
    round: numericalDisplay,
    formatDate: textDisplay
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', List(), this.parseOneOrMany(parseField));
  }

  getFn() {
    return this.options.get('fn');
  }

  getArgs() {
    return this.options.get('args');
  }

  getValue(renderData) {
    const values = this.getChildValues(renderData, this.getArgs());
    const func = FunctionType.fns[this.getFn()];
    return func(...values.toArray());
  }

  getDisplay(renderData) {
    const value = this.getValue(renderData);
    const func = FunctionType.fnDisplays[this.getFn()];
    return func[value];
  }
}


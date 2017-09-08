import {compareAll, numericalDisplay, textDisplay, truthyDisplay} from '../utils';

import ValueType from './';

export default class ComputedType extends ValueType {
  static typeName = 'computed';

  static ops = {
    '+': args => args.reduce((a, b) => a + b) || 0,
    '-': args => args.reduce((a, b) => a - b) || 0,
    '*': args => args.reduce((a, b) => a * b) || 0,
    '/': args => args.reduce((a, b) => a / b) || 0,
    '^': args => args.reduce((a, b) => Math.pow(a, b), 1),
    '>': compareAll((a, b) => a > b),
    '<': compareAll((a, b) => a < b),
    '>=': compareAll((a, b) => a >= b),
    '<=': compareAll((a, b) => a <= b),
    '=': compareAll((a, b) => a == b),
    '!=': compareAll((a, b) => a != b),
    'concat': args => args.reduce((a, b) => `${a}${b}`)
  };

  static opDisplays = {
    '+': numericalDisplay,
    '-': numericalDisplay,
    '*': numericalDisplay,
    '/': numericalDisplay,
    '^': numericalDisplay,
    '>': truthyDisplay,
    '<': truthyDisplay,
    '>=': truthyDisplay,
    '<=': truthyDisplay,
    '=': truthyDisplay,
    '!=': truthyDisplay,
    'concat': textDisplay
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', this.parseOneOrMany(parseField));
  }

  initialize(renderData) {
    super.initialize(renderData, this.getArgs());
  }

  getOp() {
    return this.options.get('op');
  }

  getArgs() {
    return this.options.get('args');
  }

  getValue(renderData) {
    const values = this.getChildValues(renderData, this.getArgs());
    const func = ComputedType.ops[this.getOp()];
    return func(values);
  }

  getDisplay(renderData) {
    const value = this.getValue(renderData);
    const func = ComputedType.opDisplays[this.getOp()];
    return func(value);
  }
}


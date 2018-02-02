import {compareAll, numericalDisplay, textDisplay, truthyDisplay} from '../utils';

import {valueRenderers} from '~/renderers';

import ValueType from './';

/**
 * @extends ValueType
 */
export default class ComputedType extends ValueType {
  static typeName = 'computed';

  static ops = {
    '+': args => args.reduce((a, b) => a + b) || 0,
    '-': args => args.reduce((a, b) => a - b) || 0,
    '*': args => args.reduce((a, b) => a * b) || 0,
    '/': args => args.reduce((a, b) => a / b) || 0,
    '^': args => args.reduce((a, b) => Math.pow(a, b), 1),
    '!': args => !args.get(0),
    '>': compareAll((a, b) => a > b),
    '<': compareAll((a, b) => a < b),
    '>=': compareAll((a, b) => a >= b),
    '<=': compareAll((a, b) => a <= b),
    '=': compareAll((a, b) => a == b),
    '!=': compareAll((a, b) => a != b),
    'concat': args => args
      .map((text = '') => (text !== null) ? `${text}` : '')
      .join('')
  };

  static opDisplays = {
    '+': numericalDisplay,
    '-': numericalDisplay,
    '*': numericalDisplay,
    '/': numericalDisplay,
    '^': numericalDisplay,
    '!': truthyDisplay,
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
    const op = this.getOp();
    const rawArgs = this.getArgs()
      .map(arg => valueRenderers.parseViewType(arg, renderData));
    const values = op == 'concat'
      ? this.getChildDisplays(renderData, rawArgs)
      : this.getChildValues(renderData, rawArgs);
    const func = ComputedType.ops[op];
    return func(values);
  }

  getDisplay(renderData) {
    const value = this.getValue(renderData);
    const func = ComputedType.opDisplays[this.getOp()];
    return func(value);
  }
}


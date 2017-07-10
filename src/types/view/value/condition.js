import {compareAll} from '../utils';

import {valueRenderers} from '~/renderers';

import ValueType from './';

export default class ConditionType extends ValueType {
  static typeName = 'condition';

  static ops = {
    '=': compareAll((a, b) => a == b),
    '!=': compareAll((a, b) => a != b),
    '>': compareAll((a, b) => a > b),
    '>=': compareAll((a, b) => a >= b),
    '<': compareAll((a, b) => a < b),
    '<=': compareAll((a, b) => a <= b),
    '&&': args => args.every(arg => !!arg),
    '||': args => args.some(arg => !!arg)
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', this.parseOneOrMany(parseField))
      .update('trueType', parseField)
      .update('falseType', field => field && parseField(field));
  }

  getOp() {
    return this.options.get('op');
  }

  getArgs() {
    return this.options.get('args');
  }

  getTrueType() {
    return this.options.get('trueType');
  }

  getFalseType() {
    return this.options.get('falseType');
  }

  /**
   * Returns true or false based on the input render data.
   * @param {RenderData} renderData - The data to test.
   * @returns {bool} `true` if the render data matches the conditions in the options.
   */
  test(renderData) {
    const func = ConditionType.ops[this.getOp()];
    const values = this.getChildValues(renderData, this.getArgs());
    return func(values);
  }

  getValue(renderData) {
    const trueType = this.getTrueType();
    const falseType = this.getFalseType();

    return this.test(renderData) ?
      valueRenderers.getValue(trueType, renderData) :
      falseType && valueRenderers.getValue(falseType, renderData);
  }

  getDisplay(renderData) {
    const trueType = this.getTrueType();
    const falseType = this.getFalseType();

    return this.test(renderData) ?
      valueRenderers.getDisplay(trueType, renderData) :
      falseType && valueRenderers.getDisplay(falseType, renderData);
  }
}


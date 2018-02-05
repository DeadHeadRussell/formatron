import {compareAll} from '../utils';

import {valueRenderers} from '~/renderers';

import ValueType from './';

/**
 * @extends ValueType
 */
export default class ConditionType extends ValueType {
  static typeName = 'condition';

  static ops = {
    '=': compareAll((a, b) => a == b),
    '!=': compareAll((a, b) => a != b),
    '>': compareAll((a, b) => a > b),
    '>=': compareAll((a, b) => a >= b),
    '<': compareAll((a, b) => a < b),
    '<=': compareAll((a, b) => a <= b),
    '!': args => !args.get(0),
    '&&': args => args.every(arg => !!arg),
    '||': args => args.some(arg => !!arg),
    'hasValue': (args, rawArgs, renderData) => {
      const {field, value} = rawArgs.get(0).getFieldAndValue(renderData);
      return field && field.hasValue(value);
    }
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', this.parseOneOrMany(parseField))
      .update('trueType', parseField)
      .update('falseType', field => field && parseField(field));
  }

  initialize(renderData) {
    super.initialize(renderData, this.getArgs());
    super.initialize(renderData, this.getTrueType());
    super.initialize(renderData, this.getFalseType());
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
   * @return {bool} `true` if the render data matches the conditions in the options.
   */
  test(renderData) {
    const rawArgs = this.getArgs()
      .map(arg => valueRenderers.parseViewType(arg, renderData));
    const func = ConditionType.ops[this.getOp()];
    const values = this.getChildValues(renderData, rawArgs);
    return func(values, rawArgs, renderData);
  }

  getValue(renderData) {
    const trueType = this.getTrueType();
    const falseType = this.getFalseType();

    return this.test(renderData)
      ? valueRenderers.getValue(trueType, renderData)
      : falseType && valueRenderers.getValue(falseType, renderData);
  }

  getDisplay(renderData) {
    const trueType = this.getTrueType();
    const falseType = this.getFalseType();

    return this.test(renderData)
      ? valueRenderers.getDisplay(trueType, renderData)
      : falseType && valueRenderers.getDisplay(falseType, renderData);
  }
}


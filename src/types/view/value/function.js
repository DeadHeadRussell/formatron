import {List} from 'immutable';
import moment from 'moment';

import {numericalDisplay, textDisplay} from '../utils';

import ValueType from './';

export default class FunctionType extends ValueType {
  static typeName = 'function';

  static fns = {
    ceil: value => Math.ceil(value),
    floor: value => Math.floor(value),
    round: value => Math.round(value),

    list: (...values) => List(values)
      .filter(value => value),

    formatDate: (value, format) => moment(value * 1000)
      .format(format),

    addDate: (value, dateString) => moment(value * 1000)
      .add(...(dateString || '').split(' '))
      .valueOf() / 1000,

    countDays: (endTimes, startTimes, addOne = true) => startTimes
      .map((startTime, index) => {
        const rawEndTime = endTimes.get(index);
        const endTime = (rawEndTime === null || typeof rawEndTime == 'undefined') ?
          (Date.now() / 1000) :
          endTimes.get(index);
        return endTime - startTime;
      })
      .map(time => time / (60 * 60 * 24))
      .map(days => Math.floor(days + (addOne ? 1 : 0)))
      .reduce((totalDays, days) => totalDays + days, 0)
  };

  static fnDisplays = {
    ceil: numericalDisplay,
    floor: numericalDisplay,
    round: numericalDisplay,
    formatDate: textDisplay,
    addDate: textDisplay,
    countDays: numericalDisplay
  };

  static parseOptions(field, parseField) {
    return super.parseOptions(field, parseField)
      .update('args', List(), this.parseOneOrMany(parseField));
  }

  initialize(renderData) {
    super.initialize(renderData, this.getArgs());
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
    return func(value);
  }
}


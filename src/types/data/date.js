import moment from 'moment';

import DataType from './';

export default class DateType extends DataType {
  static typeName = 'date';

  getType() {
    return this.options.get('dateType', 'datetime');
  }

  getFormat() {
    return this.options.get('format', this.getDefaultFormat());
  }

  getDefaultFormat() {
    switch (this.getType()) {
      case 'time':
        return 'hh:mm a';
      case 'date':
        return 'YYYY-MM-DD';
      case 'datetime':
      default:
        return 'YYYY-MM-DD hh:mm a';
    }
  }

  convert(value, toType) {
    const fromType = typeof value == 'string' ?
      'string' :
      (value instanceof Date || value instanceof moment) ?
        'datetime' :
        'unix';
    
    return this.conversions[fromType][toType](value);
  }

  getDisplay(value) {
    value = this.getValue(value);
    return this.convert(value, 'string');
  }

  unixToDatetime = value => {
    if (value === null) {
      return moment(null);
    }

    if (this.getType() == 'time') {
      return moment.utc(value * 1000);
    } else {
      return moment(value * 1000);
    }
  }

  unixToString = value => {
    const datetime = this.unixToDatetime(value);
    return this.datetimeToString(datetime);
  }

  datetimeToUnix = value => {
    if (this.getType() == 'time') {
      return datetime.hours() * 3600 + datetime.minutes() * 60 + datetime.seconds();
    } else {
      return datetime.valueOf() / 1000;
    }
  }

  datetimeToString = value => {
    if (value && value.isValid()) {
      return value.format(this.getFormat());
    }
    return '';
  }

  stringToUnix = value => {
    if (this.getType() == 'time') {
      const today = moment.utc(value, this.getFormat());
      return this.datetimeToUnix(today);
    } else {
      const datetime = this.stringToDatetime(value);
      return this.datetimeToUnix(datetime);
    }
  }

  stringToDatetime = value => {
    if (this.getType() == 'time') {
      const today = moment.utc(value, this.getFormat());
      const unixTime = this.datetimeToUnix(today);
      return this.unixToDatetime(unixTime);
    } else {
      return moment(value);
    }
  }

  conversions = {
    unix: {
      unix: value => value,
      datetime: this.unixToDatetime,
      string: this.unixToString
    },
    datetime: {
      unix: this.datetimeToUnix,
      datetime: value => value,
      string: this.datetimeToString
    },
    string: {
      unix: this.stringToUnix,
      datetime: this.stringToDatetime,
      string: value => value
    }
  }
}


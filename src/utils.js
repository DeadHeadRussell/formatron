import moment from 'moment';

export function convertDate(value, toType, options) {
  if (!options || !options.type) {
    throw new Error('`options.type` is a required options');
  }

  const fromType =
    typeof value == 'string'
      ? 'string'
      : value instanceof Date || value instanceof moment
        ? 'datetime'
        : 'unix';

  return conversions[fromType][toType](value, options);
}

const unixToDatetime = (value, options) => {
  if (value === null) {
    return moment(null);
  }

  if (options.type == 'time') {
    return moment.utc(value * 1000);
  } else {
    return moment(value * 1000);
  }
};

const unixToString = (value, options) => {
  const datetime = unixToDatetime(value, options);
  return datetimeToString(datetime, options);
};

const datetimeToUnix = (value, options) => {
  if (!value || !value.isValid()) {
    return null;
  }

  if (options.type == 'time') {
    return value.hours() * 3600 + value.minutes() * 60 + value.seconds();
  } else {
    return value.valueOf() / 1000;
  }
};

const datetimeToString = (value, options) => {
  if (value && value.isValid()) {
    return value.format(options.format);
  }
  return '';
};

const stringToUnix = (value, options) => {
  if (options.type == 'time') {
    const today = moment.utc(value, options.format);
    return datetimeToUnix(today, options);
  } else {
    const datetime = stringToDatetime(value, options);
    return datetimeToUnix(datetime, options);
  }
};

const stringToDatetime = (value, options) => {
  if (options.type == 'time') {
    const today = moment.utc(value, options.format);
    const unixTime = datetimeToUnix(today, options);
    return unixToDatetime(unixTime, options);
  } else {
    return moment(new Date(value).valueOf());
  }
};

const stringToString = (value, options) => {
  return datetimeToString(stringToDatetime(value, options), options);
};

const conversions = {
  unix: {
    unix: value => value,
    datetime: unixToDatetime,
    string: unixToString,
  },
  datetime: {
    unix: datetimeToUnix,
    datetime: value => value,
    string: datetimeToString,
  },
  string: {
    unix: stringToUnix,
    datetime: stringToDatetime,
    string: stringToString,
  },
};


export function compareAll(cmp) {
  return args => {
    const previousValue = args.reduce((previousValue, value) => {
      if (typeof previousValue == 'undefined') {
        return undefined;
      }
      return cmp(previousValue, value) ?
        value : undefined;
    });

    return typeof previousValue == 'undefined' ?
      false : true;
  };
}

export function textDisplay(value) {
  return value || '';
}

export function numericalDisplay(value) {
  return Number.isFinite(value) ?
    value :
    '';
}

export function truthyDisplay(value) {
  return value ?
    'Yes' :
    'No';
}


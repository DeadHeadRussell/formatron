import {fromJS} from 'immutable';

import {parseRef} from './refs';

// TODO: Do we need to properly parse the templates instead of doing a dumb
// regex check that will match anywhere in a string?
// This really just needs to be reworked, or even, removed from this library.
const templateSingleRegex = /{{[^}]*}}/g;
const templateArrayRegex = /{\[[^}\]]*\]}/g;

export default function parseTemplate(template, renderData, options = {}) {
  const format = options.format || (text => text);

  const {dataType, dataValue} = renderData;

  return template
    .replace(templateSingleRegex, match => {
      const ref = parseRef(match.slice(2, match.length - 2));
      const {field, value} = dataType.getFieldAndValue(dataValue, ref, renderData.options);
      return format(field.getDisplay(value, renderData.options));
    })
    .replace(templateArrayRegex, match => {
      const refs = fromJS(JSON.parse(match.slice(1, match.length - 1)))
        .map(parseRef);
      const {field, value} = dataType.getFieldAndValue(dataValue, refs, renderData.options);
      return format(field.getDisplay(value, renderData.options));
    });
}


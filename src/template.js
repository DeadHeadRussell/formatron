import {fromJS} from 'immutable';

const templateSingleRegex = /{{[^}]*}}/g;
const templateArrayRegex = /{\[[^}\]]*\]}/g;

export default function parseTemplate(template, getValue, options = {}) {
  const format = options.type == 'html' ?
    text => text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') :
    text => text;

  return template
    .replace(templateSingleRegex, match => {
      const ref = match.slice(2, match.length - 2);
      return format(getValue(ref));
    })
    .replace(templateArrayRegex, match => {
      const ref = fromJS(JSON.parse(match.slice(1, match.length - 1)));
      return format(getValue(ref));
    });

  return parsed;
}


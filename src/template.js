import {fromJS} from 'immutable';

// TODO: Do we need to properly parse the templates instead of doing a dumb
// regex check that will match anywhere in a string?
const templateSingleRegex = /{{[^}]*}}/g;
const templateArrayRegex = /{\[[^}\]]*\]}/g;

export default function parseTemplate(template, getValue, options = {}) {
  // TODO: Why is this even here...
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


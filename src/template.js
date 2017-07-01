import {fromJS} from 'immutable';

// TODO: Do we need to properly parse the templates instead of doing a dumb
// regex check that will match anywhere in a string?
const templateSingleRegex = /{{[^}]*}}/g;
const templateArrayRegex = /{\[[^}\]]*\]}/g;

export default function parseTemplate(template, renderData, options = {}) {
  // TODO: Move to main codebase and remove from here.
  /*
  const format = options.type == 'html' ?
    text => text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') :
    text => text;
  */

  const format = options.format || (text => text);

  const {dataType, dataValue} = renderData;

  return template
    .replace(templateSingleRegex, match => {
      const ref = parseRef(match.slice(2, match.length - 2));
      return format(dataType.getLabel(dataValue, ref));
    })
    .replace(templateArrayRegex, match => {
      const refs = fromJS(JSON.parse(match.slice(1, match.length - 1)))
        .map(parseRef);
      return format(dataType.getLabel(dataValue, refs));
    });
}


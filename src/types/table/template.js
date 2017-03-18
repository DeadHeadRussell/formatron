import parseTemplate from '~/template';

function getTemplateRow(options, getters) {
  return parseTemplate(options.get('template'), getters.getDataLabel);
}

export default function(register) {
  register('template', {getRow: getTemplateRow});
}


import parseTemplate from '~/template';

function getTemplateCell(options, getters) {
  return parseTemplate(options.get('template'), getters.getDataLabel);
}

function getTemplateRow(options, getters) {
  return parseTemplate(options.get('template'), getters.getDataLabel);
}

export default function(register) {
  register('template', {
    getCell: getTemplateCell,
    getRow: getTemplateRow
  });
}


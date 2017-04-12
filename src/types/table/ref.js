function getRefCell(options, getters) {
  return getters.getDataValue(options.get('ref'));
}

function getRefRow(options, getters) {
  return getters.getDataLabel(options.get('ref'));
}

export default function(register) {
  register('ref', {
    getCell: getRefCell,
    getRow: getRefRow
  });
}


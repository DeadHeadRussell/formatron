function getRefRow(options, getters) {
  return getters.getDataLabel(options.get('ref'));
}

export default function(register) {
  register('ref', {getRow: getRefRow});
}


import {registerDataTypes, registerFormTypes, registerTableTypes} from './register';

import {createDataType} from './data';
import {createFormType} from './form';
import {createTableType} from './table';
export {default as label} from './label';

export const DATA = 'data';
export const FORM = 'form';
export const TABLE = 'table';
export const LABEL = 'label';

export const data = {};
export const form = {};
export const table = {};

const types = {data, form, table};

const create = {
  [DATA]: createDataType,
  [FORM]: createFormType,
  [TABLE]: createTableType
};

registerDataTypes(registerType.bind(null, DATA));
registerFormTypes(registerType.bind(null, FORM));
registerTableTypes(registerType.bind(null, TABLE));

export function registerType(type, typeName, ...options) {
  if (types[type]) {
    types[type][typeName] = create[type](typeName, ...options);
  } else {
    throw new Error(`The type "${type}" does not exist. (while creating "${typeName}")`);
  }
}

export function parseField(type, field) {
  if (!types[type]) {
    throw new Error(`The type "${type}" does not exist. (while parsing the field "${field}")`);
  }

  if (!types[type][field.get('type')]) {
    throw new Error(`Invalid "${type}" type "${field.get('type')}" (while parsing the field "${field}")`);
  }

  return types[type][field.get('type')].parse(field, parseField.bind(null, type));
}


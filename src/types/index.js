import {registerDataTypes, registerFormTypes, registerTableTypes} from './register';

import {createDataType} from './data';
import {createFormType} from './form';
import {createTableType} from './table';

/**
 * A set of standard validation errors that user registered types can use.
 * Eg: required, invalidOption
 */
export {validationErrors} from './data';

/**
 * The sole label type. We might want to split this up into multiple types
 * (ala data, form, and table) so that more than just template parsing is
 * possible.
 */
export {default as label} from './label';

/**
 * The main types of fields. Custom types may be registered using constants.
 */
export const DATA = 'data';
export const FORM = 'form';
export const TABLE = 'table';

/**
 * The pool of fields for each type. When a new type is registered, it is
 * stored here `typeName => typeCreator`.
 *
 * The three main uses are:
 *  - typeCreator.name A read-only name of the type.
 *  - typeCreator.create A function to create a new field of this type.
 *  - typeCreator.parse A function to parse an Immutable Map object of this type.
 */
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

/**
 * Allows registration of custom data, form, and table types.
 *
 * Valid `options` depend on what type is being registered.
 * The `options` for `DATA` types are:
 *   - functions
 *   - functions.parseOptions
 *   - functions.hasValue
 *   - functions.component
 *   - functions.useLabel
 *   - functions.getDefaultValue
 *   - functions.validate
 *   - functions.toString
 *   - functions.toConditionString
 *   - functions.generateValue
 *   - schemaFunctions
 *   - schemaFunctions.getSchema
 *   - schemaFunctions.getModel
 *
 * The `options` for `FORM` types are:
 *   - functions
 *   - functions.parseOptions
 *   - functions.getValue
 *   - functions.Component
 *
 * The `options for `TABLE` types are:
 *   - functions
 *   - functions.getRow
 *
 * TODO: Look into moving this documentation into the `index.js` files for each
 * type since that is where the options values are used.
 *
 * @param type - One of `Types.DATA`, `Types.FORM` or `Types.TABLE`
 * @param {string} typeName - The name of the new type to register
 * @param options - See description
 * @throws Will throw an error if an invalid `type` is passed in.
 */
export function registerType(type, typeName, ...options) {
  if (types[type]) {
    types[type][typeName] = create[type](typeName, ...options);
  } else {
    throw new Error(`The type "${type}" does not exist. (while creating "${typeName}")`);
  }
}

/**
 * Parse an Immutable Map object and return the resulting field. The Immutable
 * Map field must contain a `type` field which represents the `typeName` to
 * attempt to parse the field as.
 *
 * TODO: The specifics of how each field type should look should be documented.
 * This might be better suited for the `index.js` files for each type since that
 * is where the parsing takes place.
 *
 * @param type - One of `Types.DATA`, `Types.FORM` or `Types.TABLE`
 * @param {Immutable.Map} field - The field represented by an Immutable Map.
 * @throws Will throw an error if an invalid `type` or `field.get('type')` is passed in.
 */
export function parseField(type, field) {
  if (!types[type]) {
    throw new Error(`The type "${type}" does not exist. (while parsing the field "${field}")`);
  }

  if (!types[type][field.get('type')]) {
    throw new Error(`Invalid "${type}" type "${field.get('type')}" (while parsing the field "${field}")`);
  }

  return types[type][field.get('type')].parse(field, parseField.bind(null, type));
}


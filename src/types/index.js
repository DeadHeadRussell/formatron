import {registerDataTypes, registerViewTypes} from './register';

import {createDataType} from './data';
import {createViewType} from './view';

/**
 * A set of standard validation errors that user registered types can use.
 * Eg: required, invalidOption
 */
export {validationErrors} from './data';

/**
 * The main types of fields. Custom types may be registered using constants.
 */
export const DATA = 'data';
export const VIEW = 'view';

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
export const view = {};

const types = {data, view};

const create = {
  [DATA]: createDataType,
  [VIEW]: createViewType
};

registerDataTypes(registerType.bind(null, DATA));
registerViewTypes(registerType.bind(null, VIEW));

/**
 * @deprecated the form, table and label types have been merged into a single view type.
 * The old label type was actually just a template type.
 */
types.form = types.table = types.view;
create.form = create.table = create.view;
export const label = types.view.template;
export const form = view;
export const table = view;

/**
 * Allows registration of custom data and view types.
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
 *   - schemaFunctions
 *   - schemaFunctions.getSchema
 *   - schemaFunctions.getModel
 *
 * The `options` for `VIEW` types are:
 *   - functions
 *   - functions.parseOptions
 *   - functions.getValue
 *   - functions.Component
 *
 * TODO: Look into moving this documentation into the `index.js` files for each
 * type since that is where the options values are used.
 *
 * @param type - One of `Types.DATA`, `Types.VIEW`
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
 * @param type - One of `Types.DATA`, `Types.VIEW`
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


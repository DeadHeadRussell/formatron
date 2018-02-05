import Immutable from 'immutable';

import TypeClass from './type';
import {registerDataTypes, registerViewTypes} from './register';

/**
 * Constant that represents data types.
 */
export const DATA = 'data';
/**
 * Constant that represents view types.
 */
export const VIEW = 'view';

/**
 * The pool of data types. When a new data type is registered, it is stored
 * here `Type.typeName -> Type`.
 */
export const data = {};
/**
 * The pool of view types. When a new view type is registered, it is stored
 * here `Type.typeName -> Type`.
 */
export const view = {};

const types = {
  [DATA]: data,
  [VIEW]: view
};

registerDataTypes(registerType.bind(null, DATA));
registerViewTypes(registerType.bind(null, VIEW));

/**
 * Registers a custom data or view type. They must inherit from the appropriate
 * base class (see {@link DataType} and {@link ViewType}).
 *
 * @param type - One of `Types.DATA`, `Types.VIEW`
 * @param {DataType|ViewType} Type - The class to be registered
 * @throws Will throw an error if an invalid `type` is passed in.
 */
export function registerType(type, Type) {
  if (!types[type]) {
    throw new Error(`The type "${type}" does not exist. (while creating "${Type.typeName}")`);
  }

  if (!Type.typeName) {
    throw new Error('A Type without a name cannot be registered');
  }

  // Bro, do you even type??
  types[type][Type.typeName] = Type;
}

/**
 * Parse an Immutable Map object and return the resulting field. The Immutable
 * Map field must contain a `type` field which represents the `typeName` to
 * attempt to parse the field as.
 *
 * @param type - One of `Types.DATA`, `Types.VIEW`
 * @param {Immutable.Map} field - The field represented by an Immutable Map.
 * @throws Will throw an error if an invalid `type` or `field.get('type')` is passed in.
 */
export function parseField(type, field) {
  if (!types[type]) {
    throw new Error(`The type "${type}" does not exist (with field: "${field}")`);
  }

  if (!field) {
    throw new Error(`Cannot parse a null field (of type: "${type}")`);
  }

  if (field instanceof TypeClass) {
    return field;
  }

  if (type == VIEW && typeof field == 'string') {
    // Allow named view type lookups.
    return field;
  }

  field = Immutable.fromJS(field);

  if (!field.get('type')) {
    throw new Error(`Cannot parse a field with an empty type (with type and field: "${type}" "${field}")`);
  }

  if (!types[type][field.get('type')]) {
    throw new Error(`Invalid field of type "${field.get('type')}" (with type and field: "${type}", "${field}")`);
  }

  return types[type][field.get('type')].parse(field, parseField.bind(null, type));
}

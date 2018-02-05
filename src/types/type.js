import Immutable, {List} from 'immutable';

/**
 * The base type that all view and data types inherit from. This provides basic
 * parsing functionality that can be overriden and used by the child types.
 */
export default class Type {
  /** The type name. This must be overridden so that the type can be registered. */
  static typeName = '';

  /**
   * Parses a JS or Immutable.js object into a type.
   *
   * @param {object|Immutable.Map} field - The field to parse.
   * @param {function} parseField - A function to parse child types.
   * @return {Type} The newly instantiated type.
   */
  static parse(field, parseField) {
    return new this(this.parseOptions(Immutable.fromJS(field), parseField));
  }

  /**
   * Override this function if you want the type to reference other types.
   *
   * @param {Immutable.Map} field - The field to parse.
   * @param {function} parseField - A function to parse a child type.
   * @return {Immutable.Map} The modified field object.
   */
  static parseOptions(field, parseField) {
    return field;
  }

  /**
   * @typedef {function} oneOrManyParser
   * Takes in either a single field or a list of fields (as Immutable json) and
   * returns either it or them parsed into types.
   * 
   * @param {Immutable.Map|Immutable.List<Immutable.Map>} fields - The field or fields to parse.
   * @return {Type|Immutable.List<Type>} The parsed type or types.
   */

  /**
   * Creates a one or many parser with the passed in field parser.
   * @param {func} parseField - The field parsing functon to use.
   * @return {oneOrManyParser} The parser function. Can be used in `.map`, etc.
   */
  static parseOneOrMany(parseField) {
    return fields => List.isList(fields) ?
      fields.map(parseField) :
      parseField(fields);
  }
}


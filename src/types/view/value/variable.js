import ValueType from './';

/**
 * @extends ValueType
 */
export default class VariableType extends ValueType {
  static typeName = 'variable';

  static variables = {
    now: () => Date.now() / 1000
  };

  static variableDisplays = {
    now: value => (new Date(value)).toLocaleString()
  };

  getVariable() {
    return this.options.get('name');
  }

  getValue(renderData) {
    const func = VariableType.variables[this.getVariable()];
    return func();
  }

  getDisplay(renderData) {
    const value = this.getValue(renderData);
    const func = VariableType.variableDisplays[this.getVariable()];
    return func(value);
  }
}


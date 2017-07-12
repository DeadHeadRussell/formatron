import RenderData from '~/renderers/renderData';
import DataType from '~/types/data';
import ViewType from '~/types/view';

export default {
  dataType: createTypeChecker(DataType, {
    instanceOf: createTypeChecker
  }),
  viewType: createTypeChecker(ViewType, {
    instanceOf: createTypeChecker
  }),
  renderData: createTypeChecker(RenderData)
};

/*
Ref based prop types.

const refValueType = React.PropTypes.oneOfType([
  React.PropTypes.string.isRequired,
  React.PropTypes.number.isRequired
]);

const refType = React.PropTypes.oneOfType([
  refValueType.isRequired,
  ImmutablePropTypes.listOf(
    refValueType.isRequired
  ).isRequired
]);
*/

const ANONYMOUS = '<<anonymous>>';

function createChainableTypeChecker(validate, subValidators = {}) {
  function checkType(isRequired, props, propName, componentName, location, propFullName, ...rest) {
    propFullName = propFullName || propName;
    componentName = componentName || '(anonymous)';
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Reqruied ${location} \`${propFullName}\` was not specified in ` +
          `\`${componentName}\`.`
        );
      }
    } else {
      return validate(props, propName, componentName, location, propFullName, ...rest);
    }
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  Object.keys(subValidators)
    .forEach(name => chainedCheckType[name] = subValidators[name]);

  return chainedCheckType;
}

function createTypeChecker(Type, subValidators) {
  return createChainableTypeChecker(validate, subValidators);

  function validate(props, propName, componentName, location, propFullName) {
    const value = props[propName];
    if (!value instanceof Type) {
      const expectedClassName = Type.name || ANONYMOUS;
      const actualClassName = getClassName(value);
      return new Error(
        `Invalid ${location} \`${propFullName}\` of type \'${value.constructor.name}\` ` +
        `supplied to \`${componentName}\`, expected a \`${Type.name}\`.`
      );
    }
  };
}

function getClassName(value) {
  if (!value || !value.constructor || !value.constructor.name) {
    return ANONYMOUS;
  }
  return value.constructor.name;
}


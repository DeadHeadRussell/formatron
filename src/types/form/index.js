import Immutable, {Iterable, List, Map} from 'immutable';

import './index.sass';

export function createFormType(typeName, functions) {
  return {
    get name() {
      return typeName;
    },
    parse,
    create
  };
  
  function converter(key, value) {
    if (value.has('typeName')) {
      return value.toJS();
    }
    return Iterable.isKeyed(value) ? Map(value) : List(value);
  }

  function parse(field, parseField) {
    field = field.remove('type');

    if (functions.parseOptions) {
      field = functions.parseOptions(field, parseField);
    }

    return create(field);
  }

  function create(options = Map()) {
    options = Immutable.fromJS(options, converter);

    return {
      get typeName() {
        return typeName;
      },

      get value() {
        return !!functions.getValue;
      },

      get display() {
        return !!functions.Component;
      },

      Component(props) {
        return <div className='form-field'>
          <functions.Component options={options} {...props} />
        </div>;
      },

      getValue(getters) {
        if (functions.getValue) {
          return functions.getValue(options, getters);
        } else {
          throw new Error(`"getValue" is not implemented for "${typeName}", "${options.get('label', '')}"`);
        }
      }
    };
  }
}

export const FormPropTypes = {
  value: createChainableTypeChecker(createFormTypeChecker('value')),
  display: createChainableTypeChecker(createFormTypeChecker('display'))
};

export function compareAll(cmp) {
  return args => {
    const previousValue = args.reduce((previousValue, value) => {
      if (typeof previousValue == 'undefined') {
        return undefined;
      }
      return cmp(previousValue, value) ?
        value : undefined;
    });

    return typeof previousValue == 'undefined' ?
      false : true;
  };
}

export function numericalDisplay(value) {
  return Number.isFinite(value) ?
    value :
    '';
}

export function truthyDisplay(value) {
  return value ?
    'Yes' :
    'No';
}

function createChainableTypeChecker(validate) {
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

  return chainedCheckType;
}

function createFormTypeChecker(formType) {
  return function(props, propName, componentName, location, propFullName) {
    const value = props[propName];
    const type = typeof value;
    if (type != 'object' || !value[formType]) {
      return new Error(
        `Invalid ${location} \`${propFullName}\` of type \'${type}\` ` +
        `supplied to \`${componentName}\`, expected a \`${formType}FormType\`.`
      );
    }
  };
}


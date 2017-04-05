import Immutable, {Iterable, List, Map} from 'immutable';

import './index.sass';

export const validationErrors = {
  required: 'This field is required',
  undefinedValue: 'This field as an undefined value',
  invalidOption: 'The value selected does not exist',
  integer: 'This field must be an integer',
  finite: 'This field must be a finite number',
  email: 'This field must be an email address',
  url: 'This field must be a URL',
  ssn: 'This field must be a valid SSN',
  tel: 'This field must be a valid US telephone number',
  zipCode: 'This field must be a valid US Zip Code',
  singleline: 'This field must contain just one line of text'
};

export function createDataType(typeName, functions, schemaFunctions) {
  const type = {
    get name() {
      return typeName;
    },
    parse,
    create
  };

  return type;

  function parse(field) {
    return create(field.get('name'), field.get('options'), field.get('path'));
  }

  function create(name, options = Map(), path = List()) {
    path = List(path);

    if (!Map.isMap(options)) {
      options = Immutable.fromJS(options);
    }

    if (functions.parseOptions) {
      options = functions.parseOptions(options, name);
    }

    let schema = null;

    return {
      get type() {
        return type;
      },
      get name() {
        return name;
      },
      get options() {
        return options;
      },
      get path() {
        return path;
      },

      set schema(s) {
        schema = s;
      },

      Component,
      useLabel,
      hasValue,
      getDefaultValue,
      validate,
      toString,
      toConditionString,
      generateValue,

      getSchema,
      getModel
    };

    function hasValue(value) {
      if (typeof value == 'undefined') {
        return false;
      }

      if (functions.hasValue) {
        return functions.hasValue(value, options);
      }
      return value !== null && (!Iterable.isIterable(value) || value.size > 0);
    }

    function Component(props) {
      const SubComponent = functions.component;
      return <div className='data-field'>
        <SubComponent {...props} name={name} options={options} schema={schema} />
      </div>;
    }

    function useLabel() {
      if (functions.useLabel) {
        return functions.useLabel(options);
      }
      return true;
    }

    function getDefaultValue() {
      if (functions.getDefaultValue) {
       return functions.getDefaultValue(options);
      }
      return null;
    }

    function validate(value) {
      try {
        if (typeof value === 'undefined') {
          if (!options.get('generated')) {
            throw new Error(validationErrors.undefinedValue);
          }
          return;
        }

        if (!hasValue(value)) {
          if (options.get('required')) {
            throw new Error(validationErrors.required);
          }
          return;
        }

        if (functions.validate) {
          functions.validate(value, options, schema);
        }

      } catch(error) {
        return error.message;
      }
    }

    function toString(value) {
      if (functions.toString) {
        return functions.toString(value, options, schema);
      }
      return (value && value.toString) ? value.toString() : '';
    }

    function toConditionString(value) {
      if (functions.toConditionString) {
        return functions.toConditionString(name, value, options);
      }
      return `${name} = ${toString(value)}`;
    }

    function getSchema() {
      if (schemaFunctions) {
        return schemaFunctions.getSchema(options, schema);
      }
      throw new Error(`"getSchema" is not implemented for "${typeName}", "${name}"`);
    }

    function getModel(value) {
      if (schemaFunctions) {
        return schemaFunctions.getModel(options, value, schema);
      }
      throw new Error(`"getModel" is not implemented for "${typeName}", "${name}"`);
    }
  }
}


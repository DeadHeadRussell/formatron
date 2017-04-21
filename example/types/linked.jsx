import {create, Select, Types} from 'formatron';

import person, {createPerson} from '../schema/person';
import task, {createTask} from '../schema/task';

const schemas = {
  0: person,
  1: task
};

const models = {
  0: [
    createPerson(0, 'Billy'),
    createPerson(1, 'Bob'),
    createPerson(2, 'Jimmy'),
    createPerson(3, 'Joey'),
    createPerson(4, 'Jenny'),
    createPerson(5, 'Jessie'),
    createPerson(6, 'Jessica'),
    createPerson(7, 'Jennifer'),
    createPerson(8, 'Jorge'),
    createPerson(9, 'Jo'),
    createPerson(10, 'Joe'),
    createPerson(11, 'Jimbo'),
    createPerson(12, 'Jambo'),
    createPerson(13, 'Jumbo'),
    createPerson(14, 'Jembo'),
    createPerson(15, 'Jombo')
  ],
  1: [
    createTask(0, 'Clean', 3),
    createTask(1, 'Wash', 1),
    createTask(2, 'Tidy', 6),
    createTask(3, 'Neaten', 4)
  ]
};

/**
 * Valid options:
 * - schemaId {int}
 */
Types.registerType(Types.DATA, 'linked', {
  component: LinkedComponent,
  validate: validateLinked,
  toString: linkedToString
}, {
  getSchema: getLinkedSchema,
  getModel: getLinkedModel
});

function LinkedComponent({name, value, options, disabled, onChange, onBlur}) {
  return <div className='form-enum'>
    <Select
      className='form-data-input select single'
      name={name}
      value={value}
      disabled={disabled}
      options={getSelectOptions(options)}
      onChange={option => onChange(optionToValue(option))}
      onBlur={onBlur}
    />
  </div>;
}

function getSelectOptions(options) {
  const schemaId = options.get('schemaId');
  const schema = schemas[schemaId];
  if (schema) {
    return models[schemaId]
      .map(model => ({
        value: model.get('id'),
        label: schema.getLabel(model)
      }));
  }
  return [];
}

function optionToValue(option) {
  if (!option || typeof option.value == 'undefined' || option.value === null) {
    return null;
  }
  const id = Number.parseInt(option.value, 10);
  if (Number.isInteger(id)) {
    return id;
  }
  return null;
}

function validateLinked(value, options) {
  const schemaId = options.get('schemaId');
  if (!models[schemaId]) {
    throw new Error('Invalid schemaId supplied');
  }

  const model = models[schemaId].find(model => model.get('id') == value);
  if (!model) {
    throw new Error(Types.validationErrors.invalidOptions);
  }
}

function linkedToString(value, options) {
  const schemaId =  options.get('schemaId');
  const schema = schemas[schemaId];
  if (schema) {
    const model = models[schemaId].find(model => model.get('id') == value);
    if (model) {
      return schema.getLabel(model);
    }
  }
  return '';
}

function getLinkedSchema(options) {
  return schemas[options.get('schemaId')];
}

function getLinkedModel(options, value) {
  return models[options.get('schemaId')].find(model => model.get('id') == value);
}


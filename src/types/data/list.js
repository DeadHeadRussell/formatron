import Immutable, {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import {createListSchema} from '~/schema';
import * as Types from '../';

export default function(register) {
  register('list', {
    parseOptions(options, name) {
      const listSubType = Types.data[options.get('listType')];

      if (!listSubType) {
        throw new Error(`Invalid list type "${options.get('listType')}" supplied to "${name}"`);
      }

      return options
        .set('listField', listSubType.create(`${name}.list`, options.get('listOptions')));
    },

    component: ListComponent,
    validate: validateList,
    getDefaultValue: getDefaultListValue,
    toString: listToString,
    hasValue: listHasValue,
    useLabel: () => false
  }, {
    getSchema(options) {
      return createListSchema(options);
    },

    getModel(options, list) {
      if (!list) {
        return null;
      }
      return list;
    }
  });
}

const ListComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  const listField = options.get('listField');

  return <div className='form-list'>
    {value.map((item, i) => <div key={i} className='form-list-item'>
      <listField.Component
        value={item}
        disabled={disabled}
        onChange={newItem => onChange(value.set(i, newItem))}
        onBlur={onBlur}
      />
      <button
        className='form-list-item-action'
        type='button'
        onClick={() => onChange(value.remove(i))}
      >
        ✕
      </button>
    </div>)}
    <button
      className='form-list-action'
      type='button'
      onClick={() => onChange(value.push(listField.getDefaultValue()))}
    >
      +
    </button>
  </div>;
};

ListComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: ImmutablePropTypes.list.isRequired,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function getDefaultListValue() {
  return List();
}

function listToString(value, options) {
  const listField = options.get('listField');
  return value
    .map(subValue => listField.toString(subValue))
    .join(', ');
}

function listHasValue(value, options) {
  if (value.size == 0) {
    return false;
  }

  const listField = options.get('listField');
  return value.every(listField.hasValue);
}

function validateList(value, options) {
  const listField = options.get('listField');
  value.forEach(item => listField.validate(item));
}


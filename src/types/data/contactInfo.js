import React from 'react';
import Immutable, {Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Label from '~/components/label';
import * as Types from '../';

export default function(register) {
  register('contactInfo', {
    parseOptions(options) {
      return options
        .update('fields', fields => fields
          .toMap()
          .mapEntries(([i, fieldName]) => [
            fieldName,
            Map({
              field: fieldsInfo[fieldName].create(name),
              label: fieldsInfo[fieldName].label
            })
          ])
        );
    },

    component: ContactInfoComponent,
    validate: validateContactInfo,
    toString: contactInfoToString,
    getDefaultValue: getDefaultContactInfoValue,
    useLabel: () => false
  });
}

const fieldsInfo = {
  'name': {
    label: 'Name',
    create: name => Types.data.text.create(`${name}.name`)
  },
  'relationship': {
    label: 'Relationship',
    create: name => Types.data.text.create(`${name}.relationship`)
  },
  'attn': {
    label: 'Attn',
    create: name => Types.data.text.create(`${name}.attn`)
  },
  'street': {
    label: 'Street',
    create: name => Types.data.text.create(`${name}.street`)
  },
  'street2': {
    label: 'Street 2',
    create: name => Types.data.text.create(`${name}.street2`)
  },
  'city': {
    label: 'City',
    create: name => Types.data.text.create(`${name}.city`)
  },
  'county': {
    label: 'County',
    create: name => Types.data.text.create(`${name}.county`)
  },
  'state': {
    label: 'State',
    create: name => Types.data.text.create(`${name}.state`)
  },
  'country': {
    label: 'Country',
    create: name => Types.data.text.create(`${name}.country`)
  },
  'zipCode': {
    label: 'Zip Code',
    create: name => Types.data.text.create(`${name}.zipCode`, {
      textType: 'zipCode'
    })
  },
  'phoneNo': {
    label: 'Phone',
    create: name => Types.data.text.create(`${name}.phoneNo`, {
      textType: 'tel'
    })
  },
  'faxNo': {
    label: 'Fax',
    create: name => Types.data.text.create(`${name}.faxNo`, {
      textType: 'tel'
    })
  },
  'email': {
    label: 'Email',
    create: name => Types.data.text.create(`${name}.faxNo`, {
      textType: 'email'
    })
  },
};

const fieldsDisplayOrder = [
  ['name'],
  ['attn'],
  ['relationship'],
  ['street'],
  ['street2'],
  ['city', 'county', 'state', 'zipCode'],
  ['country'],
  ['phoneNo', 'faxNo'],
  ['email']
];

const ContactInfoComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  const fields = options.get('fields');
  return <div className='form-contact-info'>
    {fieldsDisplayOrder
      .map(row => row
        .filter(fieldName => fields.has(fieldName))
        .map(fieldName => {
          const field = fields.get(fieldName);
          const label = field.get('label');
          const SubComponent = field.get('field').Component;

          return <label className='form-data'>
            <Label>{label}</Label>
            <SubComponent
              value={value.get(fieldName)}
              disabled={disabled}
              onChange={subValue => onChange(value.set(fieldName, subValue))}
              onBlur={onBlur}
            />
          </label>;
        })
      )
      .filter(fields => fields.length)
    }
  </div>;
};

ContactInfoComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: ImmutablePropTypes.map,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

function contactInfoToString(value, options) {
  return fieldsDisplayOrder
    .map(row => row
      .map(field => value.get(field))
      .filter(value => value)
      .join(', ')
    )
    .filter(value => value.length)
    .join('\n');
}

function getDefaultContactInfoValue() {
  return Map();
}

function validateContactInfo(value, options) {
  options.get('fields')
    .map((field, fieldName) => field
      .get('field')
      .validate(value.get(fieldName))
    );
}


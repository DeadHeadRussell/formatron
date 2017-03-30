import Immutable from 'immutable';

import {create, Types} from '~/index';

export default create('person', {
  data: [
    Types.data.number.create('id', {
      required: true,
      numberType: 'integer'
    }),
    Types.data.text.create('name', {
      required: true,
      textType: 'singleline'
    })
  ],
  label: Types.label.create('{{name}} ({{id}})')
});

export function createPerson(id, name) {
  return Immutable.fromJS({id, name});
}


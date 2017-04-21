import Immutable from 'immutable';

import {create, Types} from '~/index';

export default create('task', {
  data: [
    Types.data.number.create('id', {
      required: true,
      numberType: 'integer'
    }),
    Types.data.text.create('name', {
      required: true,
      textType: 'singleline'
    }),
    Types.data.number.create('hours', {
      required: true,
      numberType: 'float'
    })
  ],
  label: Types.view.template.create({
    template: '{{name}}'
  })
});

export function createTask(id, name, hours) {
  return Immutable.fromJS({id, name, hours});
}


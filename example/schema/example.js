import Immutable from 'immutable';

import {create, Types} from '~/index';

export default create('example', {
  data: [
    Types.data.text.create('title', {
      required: true,
      textType: 'singleline'
    }),
    Types.data.number.create('count', {
      required: true,
      numberType: 'integer'
    }),
    Types.data.number.create('count2', {
      required: true,
      numberType: 'float'
    }),
    Types.data.text.create('nested', {}, ['path', 'to']),
    Types.data.linked.create('person', {
      schemaId: 0
    }),
    Types.data.list.create('tasks', {
      defaultValue: [null],
      listType: 'linked',
      listOptions: {
        schemaId: 1
      }
    })
  ],
  form: Types.form.columns.create({
    label: 'Example Form',
    columns: [[
      Types.form.data.create({
        label: 'Title',
        ref: 'title'
      }),
      Types.form.data.create({
        label: 'Nested',
        ref: 'nested'
      }),
      Types.form.data.create({
        label: 'Person',
        ref: 'person'
      }),
      Types.form.data.create({
        label: 'Tasks',
        ref: 'tasks'
      }),
      Types.form.property.create({
        label: '# Tasks',
        obj: Types.form.data.create({ref: 'tasks'}),
        property: 'size'
      })
      /*
       * There are example refs that should be made to work for list values.
       *
      Types.form.data.create({
        label: 'Time for First Task (hrs)',
        editable: false,
        ref: ['tasks', 0, 'hours']
      }),
      Types.form.computed.create({
        label: 'One of the tasks takes 3 hrs',
        op: '=',
        left: Types.form.value.create(3),
        right: Types.form.data.create({
          ref: ['tasks', 'q:hours=3', 'hours']
        })
      })
      */
    ], [
      Types.form.header.create({
        label: 'Counts'
      }),
      Types.form.data.create({
        label: 'Count',
        ref: 'count'
      }),
      Types.form.data.create({
        label: 'Lower Count',
        ref: 'count2'
      }),
      Types.form.condition.create({
        op: '>',
        args: [
          Types.form.data.create({ref: 'count'}),
          Types.form.value.create({value: 0}),
          Types.form.data.create({ref: 'count2'})
        ],
        trueType: Types.form.computed.create({
          label: 'Some arbitrary computation',
          op: '*',
          args: [
            Types.form.data.create({ref: 'count'}),
            Types.form.value.create({value: -10}),
            Types.form.data.create({ref: 'count2'})
          ]
        })
      })
    ]]
  })
});

export function createExample() {
  return Immutable.fromJS({
    title: 'Default Title',
    path: {
      to: {
        nested: ''
      }
    }
  });
}


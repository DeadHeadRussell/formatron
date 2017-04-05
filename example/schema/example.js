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
    }),
    Types.data.number.create('disabledValue', {
      numberType: 'integer'
    }),
    Types.data.number.create('notDisabledValue', {
      numberType: 'integer'
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
      Types.form.switch.create({
        switch: Types.form.data.create({ref: 'person'}),
        cases: [{
          case: Types.form.value.create({value: 1}),
          display: Types.form.value.create({value: 'Woo, person #1!!'})
        }, {
          case: Types.form.value.create({value: 4}),
          display: Types.form.value.create({value: 'Awww, person #4 :('})
        }]
      }),
      Types.form.switch.create({
        switch: Types.form.data.create({ref: 'person'}),
        cases: [{
          case: Types.form.value.create({value: 0}),
          display: Types.form.value.create({value: 'case'})
        }],
        defaultCase: Types.form.value.create({value: 'default'})
      })
    ], [
      Types.form.data.create({
        label: 'Tasks',
        ref: 'tasks'
      }),
      Types.form.property.create({
        label: '# Tasks',
        obj: Types.form.data.create({ref: 'tasks'}),
        property: 'size'
      }),
      Types.form.computed.create({
        op: '+',
        args: Types.form.data.create({ref: ['tasks', 'm:hours']}),
        label: 'Total Time'
      }),
      Types.form.data.create({
        label: 'Time for First Task (hrs)',
        editable: false,
        ref: ['tasks', 0, 'hours']
      }),
      Types.form.computed.create({
        label: 'One of the tasks takes 3 hrs',
        op: '!=',
        args: [
          Types.form.value.create({value: null}),
          Types.form.data.create({
            ref: ['tasks', 'q:hours=3']
          })
        ]
      })
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
    ], [
      Types.form.header.create({label: 'Disabled Test'}),
      Types.form.data.create({
        ref: 'disabledValue',
        label: 'Disabled'
      }),
      Types.form.data.create({
        ref: 'notDisabledValue',
        label: 'Not Disabled'
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


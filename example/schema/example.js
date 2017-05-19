import Immutable, {List, Map} from 'immutable';

import {create, Types} from '~/index';

export default create('example', {
  data: [
    Types.data.text.create('title', {
      required: true,
      textType: 'singleline'
    }),
    Types.data.text.create('tel', {
      textType: 'tel'
    }),
    Types.data.number.create('count', {
      required: true,
      numberType: 'integer'
    }),
    Types.data.number.create('count2', {
      required: true,
      numberType: 'float'
    }),
    Types.data.bool.create('checked'),
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
    }),
    Types.data.enum.create('enum', {
      values: [
        'One',
        'Two',
        'Blue',
        'Shoe',
        'Three',
        'Four',
        'What a',
        'Chore'
      ]
    }),
    Types.data.date.create('date', {
      dateType: 'date'
    })
  ],
  form: Types.view.columns.create({
    label: 'Example Form',
    columns: [[
      Types.view.data.create({
        label: 'Date',
        ref: 'date'
      }),
      Types.view.data.create({
        label: 'Tel',
        ref: 'tel'
      }),
      Types.view.columns.create({
        label: 'Some Data',
        columns: [[
          Types.view.data.create({
            label: 'Title',
            ref: 'title'
          }),
          Types.view.data.create({
            label: 'Nested',
            ref: 'nested'
          }),
          Types.view.data.create({
            label: 'Person',
            ref: 'person'
          }),
          Types.view.switch.create({
            switch: Types.view.data.create({ref: 'person'}),
            cases: [{
              case: Types.view.value.create({value: 1}),
              display: Types.view.value.create({value: 'Woo, person #1!!'})
            }, {
              case: Types.view.value.create({value: 4}),
              display: Types.view.value.create({value: 'Awww, person #4 :('})
            }]
          }),
          Types.view.switch.create({
            switch: Types.view.data.create({ref: 'person'}),
            cases: [{
              case: Types.view.value.create({value: 0}),
              display: Types.view.value.create({value: 'case'})
            }],
            defaultCase: Types.view.value.create({value: 'default'})
          })
        ], [
          Types.view.data.create({
            label: 'Tasks',
            ref: 'tasks'
          }),
          Types.view.property.create({
            label: '# Tasks',
            obj: Types.view.data.create({ref: 'tasks'}),
            property: 'size'
          }),
          Types.view.computed.create({
            op: '+',
            args: Types.view.data.create({ref: ['tasks', 'm:hours']}),
            label: 'Total Time'
          }),
          Types.view.data.create({
            label: 'Time for First Task (hrs)',
            editable: false,
            ref: ['tasks', 0, 'hours']
          }),
          Types.view.computed.create({
            label: 'One of the tasks takes 3 hrs',
            op: '!=',
            args: [
              Types.view.value.create({value: null}),
              Types.view.data.create({
                ref: ['tasks', 'q:hours=3']
              })
            ]
          })
        ], [
          Types.view.header.create({
            label: 'Counts'
          }),
          Types.view.data.create({
            label: 'Count',
            ref: 'count'
          }),
          Types.view.data.create({
            label: 'Lower Count',
            ref: 'count2'
          }),
          Types.view.condition.create({
            op: '>',
            args: [
              Types.view.data.create({ref: 'count'}),
              Types.view.value.create({value: 0}),
              Types.view.data.create({ref: 'count2'})
            ],
            trueType: Types.view.computed.create({
              label: 'Some arbitrary computation',
              op: '*',
              args: [
                Types.view.data.create({ref: 'count'}),
                Types.view.value.create({value: -10}),
                Types.view.data.create({ref: 'count2'})
              ]
            })
          })
        ], [
          Types.view.header.create({label: 'Disabled Test'}),
          Types.view.data.create({
            ref: 'disabledValue',
            label: 'Disabled'
          }),
          Types.view.data.create({
            ref: 'notDisabledValue',
            label: 'Not Disabled'
          })
        ]]
      })
    ]]
  }),
  table: [
    Types.view.data.create({
      label: 'Title',
      ref: 'title'
    }),
    Types.view.data.create({
      label: 'Checked',
      ref: 'checked'
    }),
    Types.view.data.create({
      label: 'Person',
      ref: 'person'
    }),
    Types.view.data.create({
      label: 'Enum',
      ref: 'enum'
    }),
    Types.view.data.create({
      label: 'Date',
      ref: 'date'
    }),
    Types.view.data.create({
      label: 'Count',
      ref: 'count'
    }),
    Types.view.data.create({
      label: 'Count 2',
      ref: 'count2'
    }),
    Types.view.computed.create({
      label: 'Something',
      op: '*',
      args: [
        Types.view.data.create({ref: 'count'}),
        Types.view.value.create({value: -10}),
        Types.view.data.create({ref: 'count2'})
      ]
    })
  ]
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

export function createExamples() {
  return List()
    .set(9999, 0)
    .map((_, i) => Map({
      title: `Title ${i + 1}`,
      count: i,
      count2: -i
    }));
}


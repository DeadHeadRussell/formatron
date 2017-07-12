import Immutable, {List, Map} from 'immutable';

import {DATA, VIEW, parseField} from 'formatron/types';

export const exampleDataType = parseField(DATA, {
  type: 'map',
  options: {
    data: [{
      path: ['contact', 'name'],
      field: {
        type: 'text',
        name: 'name',
        options: {
          required: true
        }
      }
    }, {
      path: ['contact', 'tel'],
      field: {
        type: 'text',
        name: 'tel',
        options: {
          textType: 'tel'
        }
      }
    }, {
      path: ['contact', 'info'],
      field: {
        type: 'text',
        name: 'info',
        options: {
          multi: true
        }
      }
    }, {
      path: ['misc', 'count'],
      field: {
        type: 'number',
        name: 'count',
        options: {
          required: true,
          numberType: 'integer'
        }
      }
    }, {
      path: ['misc', 'checked'],
      field: {
        type: 'bool',
        name: 'checked'
      }
    }, {
      path: ['disabled'],
      field: {
        type: 'number',
        name: 'disabledValue'
      }
    }, {
      path: ['other', 'dd'],
      field: {
        type: 'enum',
        name: 'enum',
        options: {
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
        }
      }
    }, {
      path: ['other', 'da'],
      field: {
        type: 'date',
        name: 'date'
      }
    }, {
      path: ['comments'],
      field: {
        type: 'list',
        name: 'comments',
        options: {
          itemType: {
            type: 'map',
            name: 'comment',
            options: {
              data: [{
                path: ['by'],
                field: {
                  type: 'text',
                  name: 'by'
                }
              }, {
                path: ['date'],
                field: {
                  type: 'date',
                  name: 'date'
                }
              }, {
                path: ['text'],
                field: {
                  type: 'text',
                  name: 'text',
                  options: {
                    multi: true
                  }
                }
              }]
            }
          }
        }
      }
    }]
  }
});

/*
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
*/

export const exampleViewTypes = Map({
  form: parseField(VIEW, {
    type: 'tabs',
    tabs: [{
      label: 'Form',
      display: {
        type: 'grid',
        label: 'Example Form',
        orientation: 'vertical',
        children: [[{
          type: 'header',
          label: 'Contact'
        }, {
          type: 'text',
          label: 'Name',
          ref: 'name'
        }, {
          type: 'text',
          label: 'Tel',
          ref: 'tel'
        }, {
          type: 'text',
          label: 'Info',
          ref: 'info'
        }], [{
          type: 'header',
          label: 'Misc'
        }, {
          type: 'calendar',
          label: 'Date',
          ref: 'date'
        }, {
          type: 'dropDown',
          label: 'Enum',
          ref: 'enum'
        }, {
          type: 'currency',
          label: 'Count',
          ref: 'count'
        }, {
          type: 'checkbox',
          label: 'Checked',
          ref: 'checked'
        }, {
          type: 'number',
          label: 'Disabled Value',
          ref: 'disabledValue'
        }], [{
          type: 'header',
          label: 'Computed things'
        },
          'doubleCount',
          'checkedCount',
          'disabled * count'
        ]]
      }
    }, {
      label: 'Table',
      display: {
        type: 'table',
        ref: 'comments',
        columns: [{
          type: 'text',
          label: 'By',
          ref: 'by'
        }, {
          type: 'calendar',
          label: 'Date',
          ref: 'date'
        }, {
          type: 'text',
          label: 'Text',
          ref: 'text'
        }]
      }
    }]
  }),

  doubleCount: parseField(VIEW, {
    type: 'computed',
    label: 'Double Count',
    op: '*',
    args: [{
      type: 'value',
      value: 2
    }, {
      type: 'data',
      ref: 'count'
    }]
  }),

  checkedCount: parseField(VIEW, {
    type: 'condition',
    label: 'Checked Count',
    op: '=',
    args: [{
      type: 'value',
      value: true
    }, {
      type: 'data',
      ref: 'checked'
    }],
    trueType: {
      type: 'number',
      ref: 'count',
      editable: false
    }
  }),

  'disabled * count': parseField(VIEW, {
    type: 'computed',
    label: 'Figure it out...',
    op: '*',
    args: [{
      type: 'data',
      ref: 'count'
    }, {
      type: 'data',
      ref: 'disabledValue'
    }]
  })
});

/*
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


  table: Types.view.table.parse({
    columns: 
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
};

*/

export function createExamples(count) {
  return List()
    .set(count - 1, 0)
    .map((_, i) => Immutable.fromJS({
      contact: {
        name: `Name ${i + 1}`
      },
      count: i,
      checked: i % 2 == 0,
      comments: [{
        by: 'Test',
        date: 0,
        text: 'ooga booga'
      }, {
        by: '#1',
        date: 10000000,
        text: 'Hai :)'
      }]
    }));
}


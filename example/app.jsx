import Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';

import {create, Form, Types} from '../src/index';

const exampleSchema = create('example', {
  data: [
    Types.data.text.create('title', {
      required: true,
      textType: 'singleline'
    }),
    Types.data.number.create('count', {
      required: true,
      numberType: 'integer'
    }),
    Types.data.text.create('nested', {}, ['path', 'to'])
  ],
  form: Types.form.columns.create({
    label: 'Example Form',
    columns: [[
      Types.form.data.create({
        label: 'Title',
        ref: 'title'
      }),
      Types.form.data.create({
        label: 'Count',
        ref: 'count'
      }),
      Types.form.data.create({
        label: 'Nested',
        ref: 'nested'
      })
    ]]
  })
});

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      model: Immutable.fromJS({
        title: 'Default Title',
        path: {
          to: {
            value: ''
          }
        }
      })
    };
  }

  onSubmit(newModel) {
    this.setState({model: newModel});
    console.log(newModel.toJS());
  }

  render() {
    return <Form
      schema={exampleSchema}
      model={this.state.model}
      onSubmit={this.onSubmit}
      actions={[<button>Submit</button>]}
    />;
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('example-app')
);

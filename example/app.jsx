import React from 'react';
import ReactDOM from 'react-dom';

import {Form} from '../dist/formatron';

import './types/linked';

import exampleSchema, {createExample} from './schema/example';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      model: createExample()
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


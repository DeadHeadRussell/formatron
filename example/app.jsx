import {List, Map} from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';

import {Form, Table} from 'formatron';

import './types/linked';

import exampleSchema, {createExample, createExamples} from './schema/example';

class ExampleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: createExample()
    };
  }

  onSubmit = newModel => {
    this.setState({model: newModel});
    console.log(newModel.toJS());
  }

  render() {
    return <Form
      schema={exampleSchema}
      model={this.state.model}
      disabled={Map({
        disabledValue: 1,
        notDisabledValue: undefined
      })}
      onSubmit={this.onSubmit}
      actions={[<button>Submit</button>]}
    />;
  }
}

class ExampleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: createExamples(),
      editable: false
    };
  }

  saveModel = (index, model) => {
    console.log(
      `Saving index ${index} from and to:`,
      this.state.models.get(index).toJS(),
      model.toJS()
    );

    this.setState({
      models: this.state.models
        .set(index, model)
    });
  }

  toggleEditable = () => {
    this.setState({
      editable: !this.state.editable
    });
  }

  render() {
    return <div
      style={{width: '100%', height: '600px'}}
    >
      <Table
        schema={exampleSchema}
        models={this.state.models}
        editable={this.state.editable}
        onSubmit={this.saveModel}
        getToolbarButtons={List([buttons => buttons
          .unshift(<button onClick={this.toggleEditable}>
            {this.state.editable ? 'Make Uneditable' : 'Make Editable'}
          </button>)])
        }
      />
    </div>;
  }
}

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loc: 'form'
    };
  }

  go = loc => {
    this.setState({loc});
  }

  render() {
    return <div>
      <p>{this.state.loc}</p>
      <div>
        <button onClick={() => this.go('form')}>Form</button>
        <button onClick={() => this.go('table')}>Table</button>
      </div>
      {this.state.loc == 'form' ?
        <ExampleForm /> :
        <ExampleTable />
      }
    </div>;
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('example-app')
);


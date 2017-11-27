import {List, Map} from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';

import * as Types from 'formatron/types';

import Form from 'formatron/react/components/form';
import Table from 'formatron/react/components/table';

import {exampleDataType, exampleViewTypes, exampleColumns, createExamples} from './schema/example';
//import './types/linked';

import 'font-awesome-webpack-2';
import 'formatron/theme';
import './example.sass';

class ExampleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: createExamples(1).get(0)
    };
  }

  onSubmit = newModel => {
    this.setState({model: newModel});
    console.log(
      'Model updated from and to:',
      this.state.model.toJS(),
      newModel.toJS()
    );
  }

  render() {
    return <Form
      viewTypes={exampleViewTypes}
      viewType='form'
      dataType={exampleDataType}
      model={this.state.model}

      onSubmit={this.onSubmit}
      actions={[<button key='submit'>Submit</button>]}
    />;
  }
}

class ExampleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: createExamples(10000),
      editable: false,
      sortable: false
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

  toggle = (toggleable) => {
    this.setState({
      [toggleable]: !this.state[toggleable]
    });
  }

  render() {
    return <div
      style={{width: '100%', height: 600}}
    >
      <Table
        viewTypes={exampleViewTypes}
        columns={exampleColumns}
        dataType={exampleDataType}
        models={this.state.models}
        editable={this.state.editable}
        onSubmit={this.saveModel}
        sortable={this.state.sortable}
        getToolbarButtons={List([buttons => buttons
          .unshift(<button key='editable' onClick={() => this.toggle('editable')}>
            {this.state.editable ? 'Make Uneditable' : 'Make Editable'}
          </button>)
          .unshift(<button key='sortable' onClick={() => this.toggle('sortable')}>
            {this.state.sortable ? 'Make Unsortable' : 'Make Sortable'}
          </button>)
        ])}
      />
    </div>;
  }
}

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'form'
    };
  }

  render() {
    return this.state.display == 'form' ? (
      <div>
        <button onClick={() => this.setState({display: 'table'})}>Show Table</button>
        <ExampleForm />
      </div>
    ) : (
      <div>
        <button onClick={() => this.setState({display: 'form'})}>Show Form</button>
        <ExampleTable />
      </div>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('example-app')
);


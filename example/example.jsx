import {List, Map} from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome-webpack-2';

import 'formatron/types';
import 'formatron/theme';
import Form from 'formatron/react/components/form';
import Table from 'formatron/react/components/table';

import './example.sass';

import {exampleDataType, exampleViewTypes, createExamples} from './schema/example';

class ExampleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: createExamples(1).get(0)
    };
  }

  onSubmit = newModel => {
    this.setState({model: newModel});
    console.log(newModel.toJS());
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
          .unshift(<button key='editable' onClick={this.toggleEditable}>
            {this.state.editable ? 'Make Uneditable' : 'Make Editable'}
          </button>)])
        }
      />
    </div>;
  }
}

ReactDOM.render(
  <ExampleForm />,
  document.getElementById('example-app')
);

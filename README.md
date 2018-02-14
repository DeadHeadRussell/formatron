# formatron
A library that generates and validates HTML forms given a JSON schema.

## Install
`npm install --save formatron`

## Run Demo

```
$ npm install
$ npm start
```

Then navigate to http://localhost:8080/ in your browser and you should be able
to see formatron in action.

## Documentation

For a current API reference, see: https://idelic-tech.github.io/formatron/

This library is about to undergo a refactoring which will then push its version
to 1.0.0. This documentation will provide a description of how the library is
currently setup, and what the current plans are for post refactoring.

There are currently five main sections:

* Type System
* Data Types
* View Types
* Renderers
* React Implementation

### Type System
`./src/types/index.js`
`./src/types/type.js`

The type system is how formatron registers data types and view types so that it
can parse JSON into the appropriate type.

The type system maintains a registry of types for data, and one for views. It
also contains a function to register a new type, as well as one to parse JSON.

```
import * as Types from 'formatron/lib/types';
import Type from 'formatron/lib/types/type';
import DataType from 'formatron/lib/types/data';
import ViewType from 'formatron/lib/types/view';

// Types.DATA and Types.VIEW let formatron know what registry you want to work
// with.

class NewDataType extends DataType {
  // This type name is the name used when registering or accessing the type.
  // Make sure to pick something unique!!
  static typeName = 'newDataType';
}

class NewViewType extends ViewType {
  static typeName = 'newViewType';
}

Types.registerType(Types.DATA, NewDataType);
Types.registerType(Types.VIEW, NewViewType);

// After registering, you can succesfully parse them.

Types.parseField(Types.DATA, {
  type: 'newDataType',
  name: 'fieldname',
  options: { ... }
});

Types.parseField(Types.VIEW, {
  type: 'newViewType',
  ...otherOptions
});

// and access them in the code.
new Types.data.newDataType('fieldName', { ... });
new Types.view.newViewType({ ... });

```

### Data Types
Data types represent the structure of the data object. They understand how to:

* validate
* parse
* format
* default value
* initialize

However, a data type only contains the algorithms to perform the above; they do
not store the data themselves.

See `./src/types/data` for a full list of data types.
See `./src/types/data/index.js` for the base data type and the base container
data type (currently using Immutable.js)

```
const modelType = new Types.data.map('model', {
  defaultValue: {},
  data: [
    new Types.data.number('id', {
      required: true,
      numberType: 'integer',
      defaultValue: 0
    }),
    new Types.data.text('name', {
      defaultValue: ''
    })
  ]
});

modelType.getDefaultValue() == {
  id: 0,
  name: ''
};

modelType.getDisplay({id: 2, name: 'foo'}) == 'id: 2, name: foo';

modelType.validate({name: 'foo'}) == Error('Missing "id"');
```

#### Post Refactor
The `initialize()` function of the data type is called when a form is loaded so
that any external resources can be loaded (eg, foreign keys). However, this has
been determined to be outside the scope of the data type and will be refactored
to a new location in the near future.

### View Types
View types display data to the user, and define interactions to update the data.
Eg, a form, a table (that can toggle between editable or not).

The base view type (`./src/types/view/index.js`) simply defines a label and
properties for sizing either a form field or a table column.

The actual implementations for view types derive from one of the following:

* Data component views
** `./src/types/view/data/...`
** Eg, drop down, checkbox, text input
** Each data component uses the `ref` option to reference a data type
* Display views
** `./src/types/view/display/...`
** Eg, grid, tabs, condition
** Each display contains child views that it displays on the form
* Value views
** `./src/types/view/value/...`
** Eg, constant, computation
** Each value view displays a static value of some kind
** Some value views take children views as options which it uses to compute the static value
* Other views
** Various files
** Eg, button view, table of related models
** Displays some more complex view, or a view that does not fit into the above categories

```
const createFormView = new Types.view.grid({
  label: 'Create new model',
  children: [
    new Types.view.number({
      label: 'ID',
      ref: 'id'
    }),
    new Types.view.text({
      label: 'Name',
      ref: 'name'
    })
  ]
});

// Passing gridView into a Form component would display two fields, "ID" and
// "Name" to the user to edit.
```

Any formatron argument that takes a view type can also take a string. This will
cause formatron to lookup the view type in the supplied view types map. See the
Renderers section below for more details.

#### Post Refactor
View types will be modified to simply handle the display of data and handle
user inputs related to updating the data. Other functionality currently handled
by view types will be refactored to a new home.

The view types constructor signature may also change

### Renderers
Renderers are an interface that takes in a data type, data value, view type and
options, and returns a rendered value. The two types of rendered values that
formatron supports out of the box are React components and JavaScript
variables.

See `./src/renderers/renderer.js` for the renderer interface.
See `./src/renderers/renderData.js` for the render data structure.

The built in renderers also allow view type lookups by string, via a
`viewTypes` map in the render data options.

```
import {valueRenderers} from 'formatron/lib/renderers';
import reactRenderers from 'formatron/lib/react/renderers';

const views = Immutable.Map({
  annotatedName: new Types.view.computed({
    label: 'Annotated Name',
    op: 'concat',
    args: [
      new Types.view.value({value: 'Annotation: '}),
      new Types.view.data({ref: 'name'})
    ]
  }),

  createForm: createFormView // from above
});

const renderData = new RenderData(
  modelType, // from above
  {id: 2, name: 'foo'},
  {viewTypes: views}
);

// Lookup the view type
valueRenderers.getValue('annotatedName', renderData) ==
  'Annotation: foo';

// Supply a custom view type
const lengthView = new Types.view.property({
  obj: 'annotatedName',
  property: 'length'
});
valueRenderers.getDisplay(lengthView, renderData) == 15;

// Returns a react component that represents the create form view.
reactRenderers.renderFormField('createForm', renderData);
```

The list of render data options required for react forms is:

* getError(ref) : error message
* isDisabled(ref) : bool
* onChange(ref, value, viewLabel) : undefined
** viewLabel is used to display validation errors to the user
* onBlur(ref) : undefined
* onButtonClick(...args) : undefined
** The args are passed through as is to the form's `onButtonClick` prop
* submit() : undefined
** Submits the form

#### Post refactor
This may be removed entirely with renderering left up to the specific
implementation.

### React Implementation
Implements the components for forms, tables, and renderers.

The two main uses are:

#### Form
`./src/react/components/form.jsx`

Basic prop types are:

* dataType
* model
* viewType
* viewTypes

See the bottom of the source file for a complete list.

```
<Form
  dataType={modelsType}
  model={{
    id: 2,
    name: 'foo'
  }}
  viewType='createForm'
  viewTypes={views}
/>
```

#### Table
`./src/react/components/table/...`

A basic table with multiple, optional, extensions is provided:

Basic prop types are:

* dataType
* models
* columns - list of view types
* viewTypes

See the relevant source file for a complete list.

```
<Table
  dataType={modelsType}
  models={[{
    id: 2,
    name: 'foo'
  }, {
    id: 3,
    name: 'bar'
  }]}
  columns={[
    new Types.view.number({
      label: 'ID',
      ref: 'id'
    }),
    new Types.view.text({
      label: 'Name',
      ref: 'name'
    }),
    'annotatedName'
  ]},
  viewTypes={views}
/>
```

#### Post refactor
All of the form handling logic is embeded in the React components. These will
be refactored out so that they can be reused by multiple components /
renderers.

### Data Sources (Post refactor)
Data sources is a new concept for the refactor that is currently implemented
as a mishmash between the data types, view types and renderers.

The goal is for view types to describe how to interact with the data, data
sources to describe where that data comes from, and data types to make sure
that the data is valid.

Eg, a data source for:
* fetch the ID of the data model
* fetch the computed annotated name value
* fetch the document related via a foreign key

The data sources would be responsible for:
* knowing where the data is stored and how to retreive it
* knowing how to update the data when the form is changed
* knowing if the data is currently valid or invalid
* performing any required computations


## Classes

<dl>
<dt><a href="#Renderers">Renderers</a></dt>
<dd></dd>
<dt><a href="#Renderer">Renderer</a></dt>
<dd></dd>
<dt><a href="#DataType">DataType</a></dt>
<dd></dd>
<dt><a href="#Type">Type</a></dt>
<dd></dd>
<dt><a href="#DataType">DataType</a></dt>
<dd></dd>
<dt><a href="#ViewType">ViewType</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#reactRenderers">reactRenderers</a></dt>
<dd><p>A set of renderers to be used with React.js.</p>
</dd>
<dt><a href="#valueRenderers">valueRenderers</a></dt>
<dd><p>The renderers to use to render view types to js values.</p>
</dd>
<dt><a href="#validationErrors">validationErrors</a></dt>
<dd><p>A set of standard validation errors that registered types can use.</p>
<p>TODO: Add a better way to modify the basic error messages other than just
editing the imported object, which is baaaaad.</p>
</dd>
<dt><a href="#DATA">DATA</a></dt>
<dd><p>The main types of types. Naming is hard, ok?</p>
</dd>
<dt><a href="#data">data</a></dt>
<dd><p>The pool of types for each type. When a new type is registered, it is
stored here <code>Type.typeName =&gt; Type</code>.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#register">register(typeName, renderer)</a></dt>
<dd><p>Registers a new renderer for a specific type.</p>
</dd>
<dt><a href="#renderFormField">renderFormField()</a></dt>
<dd><p>See <a href="Renderer#renderFormField">Renderer#renderFormField</a></p>
</dd>
<dt><a href="#renderStaticField">renderStaticField()</a></dt>
<dd><p>See <a href="Renderer#renderStaticField">Renderer#renderStaticField</a></p>
</dd>
<dt><a href="#renderFormFilter">renderFormFilter()</a></dt>
<dd><p>See <a href="Renderer#renderFormFilter">Renderer#renderFormFilter</a></p>
</dd>
<dt><a href="#renderFilter">renderFilter()</a></dt>
<dd><p>See <a href="Renderer#renderFilter">Renderer#renderFilter</a></p>
</dd>
<dt><a href="#renderTableCell">renderTableCell()</a></dt>
<dd><p>See <a href="Renderer#renderTableCell">Renderer#renderTableCell</a></p>
</dd>
<dt><a href="#renderStaticTableCell">renderStaticTableCell()</a></dt>
<dd><p>See <a href="Renderer#renderStaticTableCell">Renderer#renderStaticTableCell</a></p>
</dd>
<dt><a href="#initialize">initialize()</a></dt>
<dd><p>Initializes the view type to display with a specific set of data. This is
normally to call the required API calls before the data is display.</p>
</dd>
<dt><a href="#getValue">getValue()</a></dt>
<dd><p>Returns the raw data value that is represented by this view type.</p>
</dd>
<dt><a href="#getDisplay">getDisplay()</a></dt>
<dd><p>Returns a &quot;pretty&quot; data value that is represented by this view type.</p>
</dd>
<dt><a href="#getTableProps">getTableProps()</a></dt>
<dd><p>Returns a map of properties to use to display a table.</p>
</dd>
<dt><a href="#parseViewType">parseViewType()</a></dt>
<dd><p>If the view type passed in is a string and if the <code>viewTypes</code> property
exists in the renderData options, attempt to look up the viewType by name.</p>
</dd>
<dt><a href="#addOptions">addOptions(newOptions)</a> ⇒ <code>RenderData</code></dt>
<dd><p>Creates a new render data struct with the passed in options added.</p>
</dd>
<dt><a href="#renderFormField">renderFormField()</a> ⇒ <code>object</code></dt>
<dd><p>Renders an interactable form field for the viewType.</p>
</dd>
<dt><a href="#renderStaticField">renderStaticField()</a> ⇒ <code>object</code></dt>
<dd><p>Renders a non-interactable field for the viewType.</p>
</dd>
<dt><a href="#renderFormFilter">renderFormFilter()</a> ⇒ <code>object</code></dt>
<dd><p>Renders an interactable field to be used for filtering this view type with
an accompanying form label.</p>
</dd>
<dt><a href="#renderFilter">renderFilter()</a> ⇒ <code>object</code></dt>
<dd><p>Renders an interactable field to be used for filtering this view type.</p>
</dd>
<dt><a href="#renderTableCell">renderTableCell()</a> ⇒ <code>object</code></dt>
<dd><p>Renders an interactable field to be used in a table for this view type.</p>
</dd>
<dt><a href="#renderStaticTableCell">renderStaticTableCell()</a> ⇒ <code>object</code></dt>
<dd><p>Renders a non-interactable field to be used in a table for this view type.</p>
</dd>
<dt><a href="#hasValue">hasValue(value)</a> ⇒ <code>bool</code></dt>
<dd><p>Checks if the passed in value is &quot;not empty&quot;.</p>
</dd>
<dt><a href="#getValue">getValue()</a></dt>
<dd><p>Returns a parsed value. A value of <code>undefined</code> implies that the value is
missing and should be filled in by a default value, first supplied in the
options, and if not, the one supplied by the type.</p>
</dd>
<dt><a href="#getDisplay">getDisplay()</a> ⇒ <code>string</code></dt>
<dd><p>Returns the value parsed for human consumption.</p>
</dd>
<dt><a href="#validate">validate()</a> ⇒</dt>
<dd><p>Validates that the given value follows the rules of the data type.</p>
</dd>
<dt><a href="#registerType">registerType(type, Type)</a></dt>
<dd><p>Registers a custom data or view type. They must inherit from the appropriate
base class (see <a href="#DataType">DataType</a> and <a href="#ViewType">ViewType</a>).</p>
</dd>
<dt><a href="#parseField">parseField(type, field)</a></dt>
<dd><p>Parse an Immutable Map object and return the resulting field. The Immutable
Map field must contain a <code>type</code> field which represents the <code>typeName</code> to
attempt to parse the field as.</p>
</dd>
<dt><a href="#parse">parse(field, parseField)</a> ⇒ <code><a href="#Type">Type</a></code></dt>
<dd><p>Parses a JS or Immutable.js object into a type.</p>
</dd>
<dt><a href="#parseOptions">parseOptions(field, parseField)</a> ⇒ <code>Immutable.Map</code></dt>
<dd><p>Override this function if you want the type to reference other types.</p>
</dd>
<dt><a href="#parseOneOrMany">parseOneOrMany(parseField)</a> ⇒ <code><a href="#oneOrManyParser">oneOrManyParser</a></code></dt>
<dd><p>Creates a one or many parser with the passed in field parser.</p>
</dd>
<dt><a href="#isAsync">isAsync()</a> ⇒ <code>bool</code></dt>
<dd><p>Supports async loading of options. The <code>getOptions</code> method will then be
passed a second argument of the current drop down text input. The return
value is expected to be a promise.</p>
</dd>
<dt><a href="#isMulti">isMulti(dataType)</a> ⇒ <code>bool</code></dt>
<dd><p>Returns if this display should allow picking multiple items or not.</p>
</dd>
<dt><a href="#getOptions">getOptions(dataType, input)</a> ⇒ <code>Immutable.List</code></dt>
<dd><p>Returns a list of avaliable options in the drop down, either specified in
this view type&#39;s options, or in the passed in data type.</p>
</dd>
<dt><a href="#getFilterOptions">getFilterOptions()</a> ⇒</dt>
<dd><p>Allows subtypes to define filter options for faster searches. Returns
undefined so that the default filter options are used.</p>
</dd>
<dt><a href="#parseOptions">parseOptions()</a> ⇒ <code>Immutable.Map</code></dt>
<dd><p>Parses the <code>ref</code> option into a {@Ref} type.</p>
</dd>
<dt><a href="#getRef">getRef()</a> ⇒ <code>Ref</code></dt>
<dd><p>Returns the reference to the underlying data. Defaults to an empty</p>
</dd>
<dt><a href="#isEditable">isEditable()</a> ⇒ <code>bool</code></dt>
<dd><p>Returns whether the underlying data type should be editable or not.
Defaults to <code>true</code>.</p>
</dd>
<dt><a href="#getPlaceholder">getPlaceholder()</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getDefaultValue">getDefaultValue()</a> ⇒ <code><a href="#ViewType">ViewType</a></code></dt>
<dd></dd>
<dt><a href="#getValue">getValue(The)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#getDisplay">getDisplay()</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#getField">getField()</a> ⇒ <code><a href="#DataType">DataType</a></code></dt>
<dd></dd>
<dt><a href="#getFieldAndValue">getFieldAndValue()</a> ⇒ <code>object</code></dt>
<dd><p>Returns the field and value of the underlying data type.</p>
</dd>
<dt><a href="#filter">filter()</a></dt>
<dd><p>Filters the value by calling the underlying field&#39;s filter function. If
the field is not found, call the super&#39;s filter function instead.</p>
</dd>
<dt><a href="#initialize">initialize(renderData, children)</a></dt>
<dd><p>Base class implementation that children can call such as:
  <code>super.initialize(this.getChildren())</code>
If a child does not override this, it means that this function will be
called with no arguments, which is a no-op.</p>
</dd>
<dt><a href="#getLabel">getLabel(renderData)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a label using 1 of 3 options. If the internal label is a basic
value, return it. If it is a view type, get its associated display value.
If it is a function, call the function with the render data.</p>
</dd>
<dt><a href="#getTableProps">getTableProps()</a> ⇒ <code>object</code></dt>
<dd><p>Returns display information for table based displays.
Currently, the only display used is react-virtualized, so the options are
entirely based on that library.</p>
<p>For a view type to be used as a table column, it must have a string label.
TODO: Consider allowing any labels, but pass in &quot;dummy&quot; render data that
always returns empty (or default) values. In the current setup, this would
work by just passing the data type and using <code>undefined</code> for the data
value.</p>
<p>If a width is supplied to the view type, the default shrink / grow factor
is 0. Otherwise, the default factor is 1 and the default width is 100.</p>
</dd>
<dt><a href="#test">test(renderData)</a> ⇒ <code>bool</code></dt>
<dd><p>Returns true or false based on the input render data.</p>
</dd>
<dt><a href="#getChildValues">getChildValues(renderData, children)</a> ⇒ <code>object</code></dt>
<dd><p>Parses either a single or a list of children view types into their
associated values.</p>
</dd>
<dt><a href="#getValue">getValue(renderData)</a> ⇒ <code>object</code></dt>
<dd><p>Returns the raw underlying value of this view type.</p>
</dd>
<dt><a href="#getDisplay">getDisplay(renderData)</a> ⇒ <code>object</code></dt>
<dd><p>Returns the underlying value of this view type in a human consumable form.</p>
</dd>
<dt><a href="#switch">switch(renderData)</a> ⇒ <code><a href="#ViewType">ViewType</a></code></dt>
<dd><p>Returns the appropriate switch case based on the input render data.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#oneOrManyParser">oneOrManyParser</a> ⇒ <code><a href="#Type">Type</a></code> | <code><a href="#Type">Immutable.List.&lt;Type&gt;</a></code></dt>
<dd><p>Takes in either a single field or a list of fields (as Immutable json) and
returns either it or them parsed into types.</p>
</dd>
</dl>

<a name="Renderers"></a>

## Renderers
**Kind**: global class  
<a name="new_Renderers_new"></a>

### new Renderers()
Collection of render functions of a specific type (eg. React renderers).

<a name="Renderer"></a>

## Renderer
**Kind**: global class  
<a name="new_Renderer_new"></a>

### new Renderer()
The renderer interface.

<a name="DataType"></a>

## DataType
**Kind**: global class  

* [DataType](#DataType)
    * [new DataType()](#new_DataType_new)
    * [new DataType()](#new_DataType_new)

<a name="new_DataType_new"></a>

### new DataType()
The base data type. Every registered data type must eventually inherit from this.

<a name="new_DataType_new"></a>

### new DataType()
The base view type for displaying data from the model.

<a name="Type"></a>

## Type
**Kind**: global class  
<a name="new_Type_new"></a>

### new Type()
The base type that all view and data types inherit from. This provides basic
parsing functionality that can be overriden and used by the child types.

<a name="DataType"></a>

## DataType
**Kind**: global class  

* [DataType](#DataType)
    * [new DataType()](#new_DataType_new)
    * [new DataType()](#new_DataType_new)

<a name="new_DataType_new"></a>

### new DataType()
The base data type. Every registered data type must eventually inherit from this.

<a name="new_DataType_new"></a>

### new DataType()
The base view type for displaying data from the model.

<a name="ViewType"></a>

## ViewType
**Kind**: global class  
<a name="new_ViewType_new"></a>

### new ViewType()
The base view type. Every registered view type must eventually inherit from this.

<a name="reactRenderers"></a>

## reactRenderers
A set of renderers to be used with React.js.

**Kind**: global constant  
<a name="valueRenderers"></a>

## valueRenderers
The renderers to use to render view types to js values.

**Kind**: global constant  
<a name="validationErrors"></a>

## validationErrors
A set of standard validation errors that registered types can use.

TODO: Add a better way to modify the basic error messages other than just
editing the imported object, which is baaaaad.

**Kind**: global constant  
<a name="DATA"></a>

## DATA
The main types of types. Naming is hard, ok?

**Kind**: global constant  
<a name="data"></a>

## data
The pool of types for each type. When a new type is registered, it is
stored here `Type.typeName => Type`.

**Kind**: global constant  
<a name="register"></a>

## register(typeName, renderer)
Registers a new renderer for a specific type.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| typeName | <code>string</code> | The name of the renderer to register. |
| renderer | [<code>Renderer</code>](#Renderer) | The renderer to register. |

<a name="renderFormField"></a>

## renderFormField()
See [Renderer#renderFormField](Renderer#renderFormField)

**Kind**: global function  
<a name="renderStaticField"></a>

## renderStaticField()
See [Renderer#renderStaticField](Renderer#renderStaticField)

**Kind**: global function  
<a name="renderFormFilter"></a>

## renderFormFilter()
See [Renderer#renderFormFilter](Renderer#renderFormFilter)

**Kind**: global function  
<a name="renderFilter"></a>

## renderFilter()
See [Renderer#renderFilter](Renderer#renderFilter)

**Kind**: global function  
<a name="renderTableCell"></a>

## renderTableCell()
See [Renderer#renderTableCell](Renderer#renderTableCell)

**Kind**: global function  
<a name="renderStaticTableCell"></a>

## renderStaticTableCell()
See [Renderer#renderStaticTableCell](Renderer#renderStaticTableCell)

**Kind**: global function  
<a name="initialize"></a>

## initialize()
Initializes the view type to display with a specific set of data. This is
normally to call the required API calls before the data is display.

**Kind**: global function  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="getValue"></a>

## getValue()
Returns the raw data value that is represented by this view type.

**Kind**: global function  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="getDisplay"></a>

## getDisplay()
Returns a "pretty" data value that is represented by this view type.

**Kind**: global function  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="getTableProps"></a>

## getTableProps()
Returns a map of properties to use to display a table.

**Kind**: global function  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to get the props of.  
<a name="parseViewType"></a>

## parseViewType()
If the view type passed in is a string and if the `viewTypes` property
exists in the renderData options, attempt to look up the viewType by name.

**Kind**: global function  
<a name="addOptions"></a>

## addOptions(newOptions) ⇒ <code>RenderData</code>
Creates a new render data struct with the passed in options added.

**Kind**: global function  
**Returns**: <code>RenderData</code> - - A new render data object.  

| Param | Type | Description |
| --- | --- | --- |
| newOptions | <code>object</code> | Arbitrary parameters to pass to the renderer. |

<a name="renderFormField"></a>

## renderFormField() ⇒ <code>object</code>
Renders an interactable form field for the viewType.

**Kind**: global function  
**Returns**: <code>object</code> - The rendered form field.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="renderStaticField"></a>

## renderStaticField() ⇒ <code>object</code>
Renders a non-interactable field for the viewType.

**Kind**: global function  
**Returns**: <code>object</code> - The rendered static field.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="renderFormFilter"></a>

## renderFormFilter() ⇒ <code>object</code>
Renders an interactable field to be used for filtering this view type with
an accompanying form label.

**Kind**: global function  
**Returns**: <code>object</code> - The renderer form filter element.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="renderFilter"></a>

## renderFilter() ⇒ <code>object</code>
Renders an interactable field to be used for filtering this view type.

**Kind**: global function  
**Returns**: <code>object</code> - The rendered table filter element.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="renderTableCell"></a>

## renderTableCell() ⇒ <code>object</code>
Renders an interactable field to be used in a table for this view type.

**Kind**: global function  
**Returns**: <code>object</code> - The rendered table cell.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="renderStaticTableCell"></a>

## renderStaticTableCell() ⇒ <code>object</code>
Renders a non-interactable field to be used in a table for this view type.

**Kind**: global function  
**Returns**: <code>object</code> - The rendered table cell.  
**Params**: [<code>ViewType</code>](#ViewType) viewType - The view type to render.  
**Params**: <code>RenderData</code> renderData - The data to render.  
<a name="hasValue"></a>

## hasValue(value) ⇒ <code>bool</code>
Checks if the passed in value is "not empty".

**Kind**: global function  
**Returns**: <code>bool</code> - `true` if it is "not empty", otherwise, `false`.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>object</code> | The data value to check. |

<a name="getValue"></a>

## getValue()
Returns a parsed value. A value of `undefined` implies that the value is
missing and should be filled in by a default value, first supplied in the
options, and if not, the one supplied by the type.

**Kind**: global function  
**Params**: <code>object</code> value - The data value to parse.  
<a name="getDisplay"></a>

## getDisplay() ⇒ <code>string</code>
Returns the value parsed for human consumption.

**Kind**: global function  
**Returns**: <code>string</code> - The parsed value.  
**Params**: <code>object</code> value - The data value to parse.  
<a name="validate"></a>

## validate() ⇒
Validates that the given value follows the rules of the data type.

**Kind**: global function  
**Returns**: An error if one was found, undefined otherwise.  
**Params**: <code>object</code> value - The value to validate.  
<a name="registerType"></a>

## registerType(type, Type)
Registers a custom data or view type. They must inherit from the appropriate
base class (see [DataType](#DataType) and [ViewType](#ViewType)).

**Kind**: global function  
**Throws**:

- Will throw an error if an invalid `type` is passed in.


| Param | Type | Description |
| --- | --- | --- |
| type |  | One of `Types.DATA`, `Types.VIEW` |
| Type | [<code>DataType</code>](#DataType) \| [<code>ViewType</code>](#ViewType) | The class to be registered |

<a name="parseField"></a>

## parseField(type, field)
Parse an Immutable Map object and return the resulting field. The Immutable
Map field must contain a `type` field which represents the `typeName` to
attempt to parse the field as.

**Kind**: global function  
**Throws**:

- Will throw an error if an invalid `type` or `field.get('type')` is passed in.


| Param | Type | Description |
| --- | --- | --- |
| type |  | One of `Types.DATA`, `Types.VIEW` |
| field | <code>Immutable.Map</code> | The field represented by an Immutable Map. |

<a name="parse"></a>

## parse(field, parseField) ⇒ [<code>Type</code>](#Type)
Parses a JS or Immutable.js object into a type.

**Kind**: global function  
**Returns**: [<code>Type</code>](#Type) - The newly instantiated type.  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>object</code> \| <code>Immutable.Map</code> | The field to parse. |
| parseField | <code>function</code> | A function to parse child types. |

<a name="parseOptions"></a>

## parseOptions(field, parseField) ⇒ <code>Immutable.Map</code>
Override this function if you want the type to reference other types.

**Kind**: global function  
**Returns**: <code>Immutable.Map</code> - The modified field object.  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>Immutable.Map</code> | The field to parse. |
| parseField | <code>function</code> | A function to parse a child type. |

<a name="parseOneOrMany"></a>

## parseOneOrMany(parseField) ⇒ [<code>oneOrManyParser</code>](#oneOrManyParser)
Creates a one or many parser with the passed in field parser.

**Kind**: global function  
**Returns**: [<code>oneOrManyParser</code>](#oneOrManyParser) - The parser function. Can be used in `.map`, etc.  

| Param | Type | Description |
| --- | --- | --- |
| parseField | <code>func</code> | The field parsing functon to use. |

<a name="isAsync"></a>

## isAsync() ⇒ <code>bool</code>
Supports async loading of options. The `getOptions` method will then be
passed a second argument of the current drop down text input. The return
value is expected to be a promise.

**Kind**: global function  
**Returns**: <code>bool</code> - `true` if the options are loaded asynchronously.  
**Params**: [<code>DataType</code>](#DataType) dataType - The data type to provide.  
<a name="isMulti"></a>

## isMulti(dataType) ⇒ <code>bool</code>
Returns if this display should allow picking multiple items or not.

**Kind**: global function  
**Returns**: <code>bool</code> - `true` if this should allow picking multiple options.  

| Param | Type | Description |
| --- | --- | --- |
| dataType | [<code>DataType</code>](#DataType) | An optional data type to provide. |

<a name="getOptions"></a>

## getOptions(dataType, input) ⇒ <code>Immutable.List</code>
Returns a list of avaliable options in the drop down, either specified in
this view type's options, or in the passed in data type.

**Kind**: global function  
**Returns**: <code>Immutable.List</code> - a list of options.  

| Param | Type | Description |
| --- | --- | --- |
| dataType | [<code>DataType</code>](#DataType) | An optional data type to check for options. |
| input | <code>string</code> | If async, the input entered to return options for. |

<a name="getFilterOptions"></a>

## getFilterOptions() ⇒
Allows subtypes to define filter options for faster searches. Returns
undefined so that the default filter options are used.

**Kind**: global function  
**Returns**: The filter options.  
<a name="parseOptions"></a>

## parseOptions() ⇒ <code>Immutable.Map</code>
Parses the `ref` option into a {@Ref} type.

**Kind**: global function  
**Returns**: <code>Immutable.Map</code> - The parsed options.  
<a name="getRef"></a>

## getRef() ⇒ <code>Ref</code>
Returns the reference to the underlying data. Defaults to an empty

**Kind**: global function  
<a name="isEditable"></a>

## isEditable() ⇒ <code>bool</code>
Returns whether the underlying data type should be editable or not.
Defaults to `true`.

**Kind**: global function  
**Returns**: <code>bool</code> - `true` if editable.  
<a name="getPlaceholder"></a>

## getPlaceholder() ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - A placeholder associated with the view.  
<a name="getDefaultValue"></a>

## getDefaultValue() ⇒ [<code>ViewType</code>](#ViewType)
**Kind**: global function  
**Returns**: [<code>ViewType</code>](#ViewType) - A default value encoded as a view type.  
<a name="getValue"></a>

## getValue(The) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - The underlying value of the data type.  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>RenderData</code> | render data to get the value of. |

<a name="getDisplay"></a>

## getDisplay() ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - The undeflying value of the data type formatted for human consumption.  
<a name="getField"></a>

## getField() ⇒ [<code>DataType</code>](#DataType)
**Kind**: global function  
**Returns**: [<code>DataType</code>](#DataType) - The underlying data type.  
<a name="getFieldAndValue"></a>

## getFieldAndValue() ⇒ <code>object</code>
Returns the field and value of the underlying data type.

**Kind**: global function  
<a name="filter"></a>

## filter()
Filters the value by calling the underlying field's filter function. If
the field is not found, call the super's filter function instead.

**Kind**: global function  
<a name="initialize"></a>

## initialize(renderData, children)
Base class implementation that children can call such as:
  `super.initialize(this.getChildren())`
If a child does not override this, it means that this function will be
called with no arguments, which is a no-op.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | the render data to initialize the type to. |
| children | [<code>ViewType</code>](#ViewType) \| [<code>List.&lt;ViewType&gt;</code>](#ViewType) | a single view type or a list of view types to call initialize on |

<a name="getLabel"></a>

## getLabel(renderData) ⇒ <code>string</code>
Returns a label using 1 of 3 options. If the internal label is a basic
value, return it. If it is a view type, get its associated display value.
If it is a function, call the function with the render data.

**Kind**: global function  
**Returns**: <code>string</code> - They label, if any, associated with the view.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The data to maybe generate the label from. |

<a name="getTableProps"></a>

## getTableProps() ⇒ <code>object</code>
Returns display information for table based displays.
Currently, the only display used is react-virtualized, so the options are
entirely based on that library.

For a view type to be used as a table column, it must have a string label.
TODO: Consider allowing any labels, but pass in "dummy" render data that
always returns empty (or default) values. In the current setup, this would
work by just passing the data type and using `undefined` for the data
value.

If a width is supplied to the view type, the default shrink / grow factor
is 0. Otherwise, the default factor is 1 and the default width is 100.

**Kind**: global function  
<a name="test"></a>

## test(renderData) ⇒ <code>bool</code>
Returns true or false based on the input render data.

**Kind**: global function  
**Returns**: <code>bool</code> - `true` if the render data matches the conditions in the options.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The data to test. |

<a name="getChildValues"></a>

## getChildValues(renderData, children) ⇒ <code>object</code>
Parses either a single or a list of children view types into their
associated values.

**Kind**: global function  
**Returns**: <code>object</code> - The computed data.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The render data to compute over. |
| children | [<code>ViewType</code>](#ViewType) \| [<code>List.&lt;ViewType&gt;</code>](#ViewType) | The child or children to parse. |

<a name="getValue"></a>

## getValue(renderData) ⇒ <code>object</code>
Returns the raw underlying value of this view type.

**Kind**: global function  
**Returns**: <code>object</code> - The computed value.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The data to compute on. |

<a name="getDisplay"></a>

## getDisplay(renderData) ⇒ <code>object</code>
Returns the underlying value of this view type in a human consumable form.

**Kind**: global function  
**Returns**: <code>object</code> - The computed value.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The data to compute on. |

<a name="switch"></a>

## switch(renderData) ⇒ [<code>ViewType</code>](#ViewType)
Returns the appropriate switch case based on the input render data.

**Kind**: global function  
**Returns**: [<code>ViewType</code>](#ViewType) - The resulting view type from the switch statement.  

| Param | Type | Description |
| --- | --- | --- |
| renderData | <code>RenderData</code> | The data to switch over. |

<a name="oneOrManyParser"></a>

## oneOrManyParser ⇒ [<code>Type</code>](#Type) \| [<code>Immutable.List.&lt;Type&gt;</code>](#Type)
Takes in either a single field or a list of fields (as Immutable json) and
returns either it or them parsed into types.

**Kind**: global typedef  
**Returns**: [<code>Type</code>](#Type) \| [<code>Immutable.List.&lt;Type&gt;</code>](#Type) - The parsed type or types.  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Immutable.Map</code> \| <code>Immutable.List.&lt;Immutable.Map&gt;</code> | The field or fields to parse. |


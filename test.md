## Modules

<dl>
<dt><a href="#module_React">React</a></dt>
<dd></dd>
<dt><a href="#module_renderers">renderers</a></dt>
<dd></dd>
<dt><a href="#module_renderers">renderers</a></dt>
<dd></dd>
<dt><a href="#module_renderers">renderers</a></dt>
<dd></dd>
<dt><a href="#module_DataTypes">DataTypes</a></dt>
<dd></dd>
<dt><a href="#module_DataTypes">DataTypes</a></dt>
<dd></dd>
<dt><a href="#module_DataTypes">DataTypes</a></dt>
<dd></dd>
<dt><a href="#module_DataTypes">DataTypes</a></dt>
<dd></dd>
<dt><a href="#module_DataTypes/">DataTypes/</a></dt>
<dd></dd>
<dt><a href="#module_Types">Types</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#DataType">DataType</a></dt>
<dd></dd>
<dt><a href="#ViewType">ViewType</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#DATA">DATA</a></dt>
<dd><p>Constant that represents data types.</p>
</dd>
<dt><a href="#VIEW">VIEW</a></dt>
<dd><p>Constant that represents view types.</p>
</dd>
<dt><a href="#data">data</a></dt>
<dd><p>The pool of data types. When a new data type is registered, it is stored
here <code>Type.typeName -&gt; Type</code>.</p>
</dd>
<dt><a href="#view">view</a></dt>
<dd><p>The pool of view types. When a new view type is registered, it is stored
here <code>Type.typeName -&gt; Type</code>.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#registerType">registerType(type, Type)</a></dt>
<dd><p>Registers a custom data or view type. They must inherit from the appropriate
base class (see <a href="#DataType">DataType</a> and <a href="#ViewType">ViewType</a>).</p>
</dd>
<dt><a href="#parseField">parseField(type, field)</a></dt>
<dd><p>Parse an Immutable Map object and return the resulting field. The Immutable
Map field must contain a <code>type</code> field which represents the <code>typeName</code> to
attempt to parse the field as.</p>
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

<a name="module_React"></a>

## React
<a name="module_React..reactRenderers"></a>

### React~reactRenderers
A set of renderers to be used with React.js.

**Kind**: inner constant of [<code>React</code>](#module_React)  
<a name="module_renderers"></a>

## renderers

* [renderers](#module_renderers)
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏

<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Collection of render functions of a specific type (eg. React renderers).

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Struct that contains all information required for rendering.

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
The renderer interface.

**Kind**: Exported class  
<a name="module_renderers"></a>

## renderers

* [renderers](#module_renderers)
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏

<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Collection of render functions of a specific type (eg. React renderers).

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Struct that contains all information required for rendering.

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
The renderer interface.

**Kind**: Exported class  
<a name="module_renderers"></a>

## renderers

* [renderers](#module_renderers)
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏
    * [module.exports](#exp_module_renderers--module.exports) ⏏

<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Collection of render functions of a specific type (eg. React renderers).

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
Struct that contains all information required for rendering.

**Kind**: Exported class  
<a name="exp_module_renderers--module.exports"></a>

### module.exports ⏏
The renderer interface.

**Kind**: Exported class  
<a name="module_DataTypes"></a>

## DataTypes

* [DataTypes](#module_DataTypes)
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏

<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for boolean values.

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for date values.

Allowed options:
 dateType: date | time | datetime (default)
 format: Format string. Uses moment's format strings. Default: 'YYYY-MM-DD hh:mm a' as applicable

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for dictionary values.

Allowed options:
 keyType: DataType for the keys
 valueType: DataType for the values

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
DataType for enumerated values.

Allowed options:
 multi: bool (default false)
 values: list of {value, label} objects. If a list of strings is passed in, the string is interpreted as both the value and the label.

**Kind**: Exported class  
<a name="module_DataTypes"></a>

## DataTypes

* [DataTypes](#module_DataTypes)
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏

<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for boolean values.

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for date values.

Allowed options:
 dateType: date | time | datetime (default)
 format: Format string. Uses moment's format strings. Default: 'YYYY-MM-DD hh:mm a' as applicable

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for dictionary values.

Allowed options:
 keyType: DataType for the keys
 valueType: DataType for the values

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
DataType for enumerated values.

Allowed options:
 multi: bool (default false)
 values: list of {value, label} objects. If a list of strings is passed in, the string is interpreted as both the value and the label.

**Kind**: Exported class  
<a name="module_DataTypes"></a>

## DataTypes

* [DataTypes](#module_DataTypes)
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏

<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for boolean values.

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for date values.

Allowed options:
 dateType: date | time | datetime (default)
 format: Format string. Uses moment's format strings. Default: 'YYYY-MM-DD hh:mm a' as applicable

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for dictionary values.

Allowed options:
 keyType: DataType for the keys
 valueType: DataType for the values

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
DataType for enumerated values.

Allowed options:
 multi: bool (default false)
 values: list of {value, label} objects. If a list of strings is passed in, the string is interpreted as both the value and the label.

**Kind**: Exported class  
<a name="module_DataTypes"></a>

## DataTypes

* [DataTypes](#module_DataTypes)
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏
    * [module.exports](#exp_module_DataTypes--module.exports) ⏏

<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for boolean values.

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for date values.

Allowed options:
 dateType: date | time | datetime (default)
 format: Format string. Uses moment's format strings. Default: 'YYYY-MM-DD hh:mm a' as applicable

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
The DataType for dictionary values.

Allowed options:
 keyType: DataType for the keys
 valueType: DataType for the values

**Kind**: Exported class  
<a name="exp_module_DataTypes--module.exports"></a>

### module.exports ⏏
DataType for enumerated values.

Allowed options:
 multi: bool (default false)
 values: list of {value, label} objects. If a list of strings is passed in, the string is interpreted as both the value and the label.

**Kind**: Exported class  
<a name="module_DataTypes/"></a>

## DataTypes/
<a name="exp_module_DataTypes/--module.exports"></a>

### module.exports ⏏
The base data type. Every registered data type must eventually inherit from this.

**Kind**: Exported class  
<a name="module_Types"></a>

## Types

* [Types](#module_Types)
    * _instance_
        * [.typeName](#module_Types+typeName)
    * _static_
        * [.parse(field, parseField)](#module_Types.parse) ⇒ <code>Type</code>
        * [.parseOptions(field, parseField)](#module_Types.parseOptions) ⇒ <code>Immutable.Map</code>
        * [.parseOneOrMany(parseField)](#module_Types.parseOneOrMany) ⇒ <code>oneOrManyParser</code>
    * _inner_
        * [~Type](#module_Types..Type)
            * [new Type()](#new_module_Types..Type_new)
        * [~oneOrManyParser](#module_Types..oneOrManyParser) ⇒ <code>Type</code> \| <code>Immutable.List.&lt;Type&gt;</code>

<a name="module_Types+typeName"></a>

### types.typeName
The type name. This must be overridden so that the type can be registered.

**Kind**: instance property of [<code>Types</code>](#module_Types)  
<a name="module_Types.parse"></a>

### Types.parse(field, parseField) ⇒ <code>Type</code>
Parses a JS or Immutable.js object into a type.

**Kind**: static method of [<code>Types</code>](#module_Types)  
**Returns**: <code>Type</code> - The newly instantiated type.  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>object</code> \| <code>Immutable.Map</code> | The field to parse. |
| parseField | <code>function</code> | A function to parse child types. |

<a name="module_Types.parseOptions"></a>

### Types.parseOptions(field, parseField) ⇒ <code>Immutable.Map</code>
Override this function if you want the type to reference other types.

**Kind**: static method of [<code>Types</code>](#module_Types)  
**Returns**: <code>Immutable.Map</code> - The modified field object.  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>Immutable.Map</code> | The field to parse. |
| parseField | <code>function</code> | A function to parse a child type. |

<a name="module_Types.parseOneOrMany"></a>

### Types.parseOneOrMany(parseField) ⇒ <code>oneOrManyParser</code>
Creates a one or many parser with the passed in field parser.

**Kind**: static method of [<code>Types</code>](#module_Types)  
**Returns**: <code>oneOrManyParser</code> - The parser function. Can be used in `.map`, etc.  

| Param | Type | Description |
| --- | --- | --- |
| parseField | <code>func</code> | The field parsing functon to use. |

<a name="module_Types..Type"></a>

### Types~Type
**Kind**: inner class of [<code>Types</code>](#module_Types)  
<a name="new_module_Types..Type_new"></a>

#### new Type()
The base type that all view and data types inherit from. This provides basic
parsing functionality that can be overriden and used by the child types.

<a name="module_Types..oneOrManyParser"></a>

### Types~oneOrManyParser ⇒ <code>Type</code> \| <code>Immutable.List.&lt;Type&gt;</code>
Takes in either a single field or a list of fields (as Immutable json) and
returns either it or them parsed into types.

**Kind**: inner typedef of [<code>Types</code>](#module_Types)  
**Returns**: <code>Type</code> \| <code>Immutable.List.&lt;Type&gt;</code> - The parsed type or types.  

| Param | Type | Description |
| --- | --- | --- |
| fields | <code>Immutable.Map</code> \| <code>Immutable.List.&lt;Immutable.Map&gt;</code> | The field or fields to parse. |

<a name="DataType"></a>

## DataType
**Kind**: global class  
<a name="new_DataType_new"></a>

### new DataType()
The base view type for displaying data from the model.

<a name="ViewType"></a>

## ViewType
**Kind**: global class  
<a name="new_ViewType_new"></a>

### new ViewType()
The base view type. Every registered view type must eventually inherit from this.

<a name="DATA"></a>

## DATA
Constant that represents data types.

**Kind**: global constant  
<a name="VIEW"></a>

## VIEW
Constant that represents view types.

**Kind**: global constant  
<a name="data"></a>

## data
The pool of data types. When a new data type is registered, it is stored
here `Type.typeName -> Type`.

**Kind**: global constant  
<a name="view"></a>

## view
The pool of view types. When a new view type is registered, it is stored
here `Type.typeName -> Type`.

**Kind**: global constant  
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


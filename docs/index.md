# Class

## `Renderers`

Collection of render functions of a specific type (eg. React renderers).

### `constructor(renderers: object.<string, Renderer>)`

Creates a new set of renderers for a set of types.

### `renderers: *`

### `cachedValues: *`

### `register(typeName: string, renderer: Renderer)`

Registers a new renderer for a specific type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| typeName | string |  | The name of the renderer to register. |
| renderer | Renderer |  | The renderer to register. |

### `bustCache(type: *, viewType: *, dataValue: *)`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| type | * | nullable: undefined |
| viewType | * | nullable: undefined |
| dataValue | * | nullable: undefined |

### `cache(type: *, viewType: *, dataValue: *, create: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| type | * | nullable: undefined |
| viewType | * | nullable: undefined |
| dataValue | * | nullable: undefined |
| create | * | nullable: undefined |

### `renderFormField(viewType: *, renderData: *): *`

See {@link Renderer#renderFormField}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderStaticField(viewType: *, renderData: *): *`

See {@link Renderer#renderStaticField}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderFormFilter(viewType: *, renderData: *): *`

See {@link Renderer#renderFormFilter}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderFilter(viewType: *, renderData: *): *`

See {@link Renderer#renderFilter}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderTableCell(viewType: *, renderData: *): *`

See {@link Renderer#renderTableCell}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderStaticTableCell(viewType: *, renderData: *): *`

See {@link Renderer#renderStaticTableCell}

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `initialize(viewType: *, renderData: *): *`

Initializes the view type to display with a specific set of data. This is normally to call the required API calls before the data is display.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `getValue(viewType: *, renderData: *): *`

Returns the raw data value that is represented by this view type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `getDisplay(viewType: *, renderData: *): *`

Returns a "pretty" data value that is represented by this view type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `getTableProps(viewType: *, renderData: *): *`

Returns a map of properties to use to display a table.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `parseViewType(viewType: *, renderData: *): *`

If the view type passed in is a string and if the `viewTypes` property exists in the renderData options, attempt to look up the viewType by name.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `getViewTypes(renderData: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| renderData | * | nullable: undefined |

## `Renderer`

The renderer interface.

### `constructor()`

### `renderFormField(viewType: *, renderData: *): object`

Renders an interactable form field for the viewType.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderStaticField(viewType: *, renderData: *): object`

Renders a non-interactable field for the viewType.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderFormFilter(viewType: *, renderData: *): object`

Renders an interactable field to be used for filtering this view type with an accompanying form label.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderFilter(viewType: *, renderData: *): object`

Renders an interactable field to be used for filtering this view type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderTableCell(viewType: *, renderData: *): object`

Renders an interactable field to be used in a table for this view type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

### `renderStaticTableCell(viewType: *, renderData: *): object`

Renders a non-interactable field to be used in a table for this view type.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| viewType | * | nullable: undefined |
| renderData | * | nullable: undefined |

## `ValidationError`

### `constructor()`

### `field: *`

### `value: *`

### `ref: *`

### `addRef(ref: *)`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| ref | * | nullable: undefined |

# Function

## `parseTemplate(template: *, renderData: *, options: {}): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| template | * | nullable: undefined |
| renderData | * | nullable: undefined |
| options | {} | nullable: undefined, optional: true, default: {} |

## `registerType(type: *, Type: DataType|ViewType)`

Registers a custom data or view type. They must inherit from the appropriate base class (see {@link DataType} and {@link ViewType}).

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| type | * |  | One of `Types.DATA`, `Types.VIEW` |
| Type | DataType|ViewType |  | The class to be registered |

## `parseField(type: *, field: Immutable.Map): *`

Parse an Immutable Map object and return the resulting field. The Immutable Map field must contain a `type` field which represents the `typeName` to attempt to parse the field as.

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| type | * |  | One of `Types.DATA`, `Types.VIEW` |
| field | Immutable.Map |  | The field represented by an Immutable Map. |

## `registerDataTypes(register: *)`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| register | * | nullable: undefined |

## `registerViewTypes(register: *)`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| register | * | nullable: undefined |

## `compareAll(cmp: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| cmp | * | nullable: undefined |

## `textDisplay(value: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| value | * | nullable: undefined |

## `numericalDisplay(value: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| value | * | nullable: undefined |

## `truthyDisplay(value: *): *`

| Name | Type | Attribute | Description |
| --- | --- | --- | --- |
| value | * | nullable: undefined |
# Rate and Rank

I wanted a way to quickly put together lists of things (e.g. red wine vintages, olive oil brands, indian dishes) and give them
numeric ratings as well as sort (rank) them. I want this to be flexible and easy to configure and not be as slow and clunky as
a Google sheet or doc.

## Parts of the Project:

### Core Data Grid Data Structure

A core module that holds the data structure for a grid. This is called `DataGrid` and holds its state
internally using a redux-style pattern. Sending an action to an instance will produce a new state but not modify the previous
one. It keeps an internal record of past and future states so that undo and redo are just regular actions you can send 
and it handles rewinding or fast-forwarding the state. This core module is thoroughly unit tested (test/DataGrid.spec.js)
and is useful for keeping track of all kinds of tabular data.

### Snabbdom View

A react-like view that takes a state object from a DataGrid and renders it to html. Adds lots of event handling on top
to handle interactive editing. All edits that modify the grid send an action back to the underlying DataGrid object to
produce a new state, which is then used to re-render the view. Snabbdom takes care of only updating nodes that had changes.

The view can be instantiated in two ways, both of which encapsulate all of the behavior so that multiple grids can
co-exist on the same page. If initialized with a configuration object and array of rows then it will set up a DataGrid
instance in the browser tab. Changes will not persist past a page refresh. This method is used for the live demos. The
alternative way to initialize an instance is to give it the URL address of a DataGrid in the REST API. The grid must
already exist in the Node backend. Actions will be sent using a PUT to the API, and new state will be fetched to re-render
the view. The DataGrid instance lives in the Node server's memory and will be persisted each time an action is sent.

All grids in a given browser window share a global undo order. Any time an action is performed on any grid it will add
an entry in the global list. The global undo controls (the footer buttons and the window-wide control+z key listener)
pop the last record off and invoke it, which signals the source grid to fire its own undo action. This ways actions can
be un-done in the order they were originally done, even across different grids (which do not share any information).

### Node Server

An express-powered web server that provides a back-end for DataGrids. Users can log in and create DataGrids which will
be persisted to disk by the server. These are made available via a REST API as well.

## Setup and Run Server

After cloning the repository, 
   * `npm install`
   * `npm run build` (or `npm run watch`)
   * `cd server` 
   * `npm install`
   * `npm start`
   * visit localhost:8666 in a browser

## Guide and Reference

### Creating a Data Grid

You get an instance of a DataGrid by passing the the DataGrid function a config object. The configuration must conform
to the JSON schema in _/schema/DataGridConfig.schema.json_ (you will get back `null` if there is a problem, and an error
will be logged). Important details in the config are a name for the grid and an array of columns. Example:

```javascript
const DataGrid = require('./src/DataGrid');

const config = {
    name: 'New Grid',
    columns: [
        {name: 'Column A'},
        {name: 'Column B', type: 'string'},
        {name: 'Column C', type: 'number'}
    ]
};

const instance = DataGrid(config);
```

#### Column Definitions

The objects in the column array define the columns of the grid. They will appear in the state and in the view in the 
same order as they are defined in the config. If no type is specified, the default is "string".

Allowed column types are:
   * `string` - plain text
   * `number` - an integer number
   * `markdown` - rich text, which the view will interpret according to [Markdown standard formatting rules](https://spec.commonmark.org/current/)
   * `image` - any image data, which the view will display in the `src` attribute of an `img` tag 
   * `option` - a single choice from a set of values. Must include an `options` property in the form of an object where 
                the keys are the option values and the values are the labels. Example:
        ```javascript
        options: {
             chicken: "Chicken",
             fish: "Fish",
             vegetarian: "Vegetarian"
        }
        ```

Columns can include an optional default value which will be assigned to new rows if no initial value is included for the
the column. 

Note that the DataGrid object also has a toJson() method which returns a JSON string representation of the grid in its
current state. This string can be passed to the `DataGrid` initializer rather than a config object to un-serialize the
JSON string and return a new DataGrid instance with the state that was serialized.

#### Initial Rows

As a second argument to the `DataGrid` initializer function you may pass an array of objects which will be set as the rows
of the grid, so that it has some content already in it. The objects should have a key for each column, and the key must
match the column name exactly in order to match. Example rows that would go with the `instance` grid from above:

```javascript
[
    {'Column A': 'A1', 'Column B': 'B1', 'Column C': 1},
    {'Column A': 'A2', 'Column B': 'B2', 'Column C': 2},
    {'Column A': 'A3', 'Column B': 'B3', 'Column C': 3}
]
```

### Modifying a DataGrid

The following operations are supported:

   * `addRow` add a new row, with optional values for columns
   * `removeRow` one at a time, or a span
   * `moveRow` to another spot in the order
   * `setField` of a single column on a single row
   * `setField` on multiple columns on a single row
   * `setField` of a single column to the same value for all rows
   * `setField` on all rows by applying a function to the value of a single column (example: multiply Column C of each row by two)
   * `addColumn` which modifies the config and adds a default value to all rows
   * _Remove a column_ (pending)
   * `undo` any of the above actions
   * `redo` a previously-undone action

To modify the state of a DataGrid you must pass it a message using its `send()` method. At minimum you must pass an object
specifying which action (using an `actionName` listed above). Example: `instance.send({action: 'addRow'});`

After sending the action you can use `getState()` to retrieve a representation of the current grid state including the 
changes from the action, if any. Note that if the action would not have any effect the exact same state is returned. In
the case of an in-memory DataGrid you can check object equivalence to avoid any rendering at all. 

Some actions don't require any additional parameters, while some have several options. These are detailed below:

#### Add Row
With no additional parameters this will add a blank row to the end of the grid with all default values determined by the
column definitions.

If you want to specify the initial values include a `row` parameter which is an object mapping column names to values.
Example: `instance.send({action: 'addRow', row: {'Column A': 'A4', 'Column B': 'B4', 'Column C': 4}})`

#### Remove Row
Requires a `rowIndex` parameter that specifies which row (zero-indexed) to remove. 

An optional `count` parameter allows you to remove a span of rows starting at `rowIndex`.

Example: `instance.send({action: 'removeRow', rowIndex: 0})` will remove the first row.

#### Move Row

`rowIndex`
`newIndex`

#### Set Field

#### Add Column

#### Undo / Redo
These don't require any parameters, they simply shift the grid's internal state backwards or forwards.

## TODO / Known Issues

   * UI controls to edit / remove images
   * Better control over column widths and content alignment
   * Fix the fact that the grid rows are the grid containers (messes up if content is too wide)
   * UI controls to change columns (config, width, and order)
   * Node backend: Better user store and user management in Node server
   * Node backend: Better "new grid" form with nice controls to configure the columns

   
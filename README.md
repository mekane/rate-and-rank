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

## TODO / Known Issues

   * UI controls to edit / remove images
   * Better control over column widths and content alignment
   * Fix the fact that the grid rows are the grid containers (messes up if content is too wide)
   * UI controls to change columns (config, width, and order)
   * Node backend: Better user store and user management in Node server
   * Node backend: Better "new grid" form with nice controls to configure the columns

   
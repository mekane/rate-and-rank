const express = require('express');

let userRepository;

let initialized = false;

function initialize(port, injectedSessionHandler, injectedUserRepo) {
    if (initialized)
        throw new Error('Error server is already running!');

    userRepository = injectedUserRepo;

    const app = express();
    app.use(express.static('public'));
    app.use(injectedSessionHandler);
    app.engine('mustache', require('mustache-express')());
    app.set('view engine', 'mustache');

    app.get('/', showHomepage);
    app.get('/grid', listActiveGrids);
    app.get('/grid/:id', showGrid);
    app.listen(port, () => console.log(`Rate and Rank app listening on port ${port}!`));
    initialized = true;
}


const DataGrid = require('../src/DataGrid');

const activeGrids = {
    1: DataGrid({name: 'Test Grid 1', columns: [{name: 'Name'}, {name: 'Description'}]}),
    2: DataGrid({name: 'Another Grid 2', columns: [{name: 'Test2'}]}),
    3: DataGrid({name: 'Grid Boom 3', columns: [{name: 'Test3'}]})
};


function showHomepage(req, res) {
    res.render('home', {title: 'Home'});
}

function listActiveGrids(req, res) {
    const grids = [];

    Object.keys(activeGrids).forEach(id => {
        grids.push({id, name: activeGrids[id].getState().config.name});
    });

    res.render('list', {title: 'All Data Grids', grids});
}

function showGrid(req, res) {
    const gridId = req.params['id'];
    const grid = activeGrids[gridId];
    const gridName = grid.getState().config.name;

    res.render('grid', {title: gridName, gridName});
}

module.exports = {
    initialize
};
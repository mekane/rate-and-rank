'use strict';

function DataGrid(initialConfig, initialRows = []) {

    let state = {
        rows: initialRows
    };

    function getInitialConfig() {
        return copy(initialConfig);
    }

    function getRows() {
        return copy(state.rows);
    }

    function send(message) {

    }

    return {
        getInitialConfig,
        getRows,
        send
    };
}


function copy(object) {
    return JSON.parse(JSON.stringify(object));
}

module.exports = DataGrid;
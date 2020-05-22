'use strict';

function handleMessage(config, state = {}, action = '', data) {
    switch (action.toLowerCase()) {
        case 'addrow':
            return Object.assign({}, state, {rows: addRow(config, state.rows, data)});
        case 'removerow':
            return Object.assign({}, state, {rows: removeRows(state.rows, data)});
        default:
            console.log(`UNKNOWN ACTION ${action}`);
            return state;
    }
}

function addRow(config, previousState, data) {
    const nextState = copy(previousState);

    const newRow = {};

    config.columns.map(c => c.name).forEach(columnName => {
        if (data.row && data.row[columnName])
            newRow[columnName] = data.row[columnName]
        else
            newRow[columnName] = '';
    });

    nextState.push(newRow);
    return nextState;
}

function removeRows(previousState, data) {
    let start = parseInt(data.index);
    if (isNaN(start) || start < 0 || start > previousState.length)
        return previousState;

    let count = parseInt(data.count);
    if (isNaN(count))
        count = 1;

    console.log(`remove row ${start} (${typeof start})`)

    const nextState = copy(previousState);

    if (typeof start === 'number')
        nextState.splice(start, count);

    return nextState;
}

/*****************************************************************************
 * The factory function that returns a new data grid instance based on the
 * given configuration and optionally containing some initial rows.
 *****************************************************************************/
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

    function send(message = {}) {
        //push old state

        //console.log(state);

        const nextState = handleMessage(initialConfig, state, message.action, message);

        //console.log(nextState);

        state = nextState;
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
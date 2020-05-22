'use strict';

function handleMessage(config, state = {}, action = '', data) {
    switch (action.toLowerCase()) {
        case 'addrow':
            return Object.assign({}, state, {rows: addRow(config, state.rows, data)});
        default:
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
'use strict';
const Validator = require('jsonschema').Validator;
const dataGridConfigSchema = require('../schema/DataGridConfig.schema.json');
const schemaValidator = new Validator();


function handleMessage(config, state = {}, action = '', data) {
    switch (action.toLowerCase()) {
        case 'addrow':
            return nextState(state, 'rows', addRow(config, state.rows, data));
        case 'removerow':
            return nextState(state, 'rows', removeRows(state.rows, data));
        case 'setfield':
            return nextState(state, 'rows', setField(config, state.rows, data));
        default:
            console.log(`UNKNOWN ACTION ${action}`);
            return state;
    }
}

function nextState(previousState, propertyName, newState) {
    if (previousState[propertyName] === newState)
        return previousState;
    return Object.assign({}, previousState, {[propertyName]: newState});
}

function addRow(config, previousState, data) {
    const nextState = copy(previousState);

    const newRow = {};

    config.columns.forEach(columnConfig => {
        const columnName = columnConfig.name;

        if (data.row && data.row[columnName])
            newRow[columnName] = data.row[columnName]
        else
            newRow[columnName] = defaultValueForColumn(columnConfig);
    });

    nextState.push(newRow);
    return nextState;
}

function defaultValueForColumn(columnConfig) {
    const config = columnConfig || {};

    if (config.default)
        return config.default;
    else if (columnConfig.type === 'number')
        return 0;
    return '';
}

function removeRows(previousState, data) {
    let start = parseInt(data.index);
    if (isNaN(start) || start < 0 || start > previousState.length)
        return previousState;

    let count = parseInt(data.count);
    if (isNaN(count))
        count = 1;

    const nextState = copy(previousState);
    nextState.splice(start, count);
    return nextState;
}

function setField(config, previousState, data) {
    const nextState = copy(previousState);

    if (data.rowIndex) {
        const rowToChange = nextState[data.rowIndex];

        if (data.columnName && data.value) {
            rowToChange[data.columnName] = data.value;
            return nextState;
        }
        else if (data.values) {
            Object.keys(data.values).forEach(columnName => {
                rowToChange[columnName] = data.values[columnName];
            });
            return nextState;
        }
    }
    else if (data.columnName) {
        const columnName = data.columnName;

        if (data.value) {
            nextState.forEach(row => {
                row[columnName] = data.value;
            });
            return nextState;
        }
        else if (data.fn && typeof data.fn === 'function') {
            const columnConfig = config.columns[columnName];
            nextState.forEach((row, i) => {
                row[columnName] = data.fn(row[columnName], i, columnConfig);
            });
            return nextState;
        }
    }

    return previousState;
}

/*****************************************************************************
 * The factory function that returns a new data grid instance based on the
 * given configuration and optionally containing some initial rows.
 *****************************************************************************/
function DataGrid(initialConfig, initialRows = []) {

    const result = schemaValidator.validate(initialConfig, dataGridConfigSchema);
    if (result.errors[0])
        throw new Error('Invalid configuration: ' + result.errors[0].stack);

    const rows = initialRows.reduce((prevState, nextRow) => {
        return addRow(initialConfig, prevState, {row: nextRow});
    }, []);

    let past = [];
    let state = {
        rows
    };
    let future = [];

    function getInitialConfig() {
        return copy(initialConfig);
    }

    function getState() {
        return state;
    }

    function getUndoCount() {
        return past.length;
    }

    function send(message = {}) {
        const action = message.action.toLowerCase();

        //UNDO - put present at beginning of future, pop most recent past state
        if (action === 'undo') {
            if (past.length) {
                future.unshift(state);
                state = past.pop();
            }
        }

            //REDO
            // Shift first item off of future
            // Set present to the shifted item
            // Push old present onto end of past

            //Other Action
            // Push present onto end of past
            // Set present to next state
        // Clear future
        else {
            past.push(state);
            state = handleMessage(initialConfig, state, message.action, message);
            future = [];
        }
    }

    return {
        getInitialConfig,
        getRows: _ => state.rows,
        getState,
        getUndoCount,
        send
    };
}


function copy(object) {
    return JSON.parse(JSON.stringify(object));
}

module.exports = DataGrid;
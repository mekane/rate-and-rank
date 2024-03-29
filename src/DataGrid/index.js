'use strict';
const Validator = require('jsonschema').Validator;
const dataGridConfigSchema = require('../schema/DataGridConfig.schema.json');
const schemaValidator = new Validator();


function handleMessage(state = {}, action = '', data) {
    switch (action.toLowerCase()) {
        case 'addcolumn':
            return nextState(state, addColumn(state, data));
        case 'addrow':
            return nextState(state, {'rows': addRow(state.config, state.rows, data)});
        case 'moverow':
            return nextState(state, {'rows': moveRow(state.rows, data)});
        case 'removerow':
            return nextState(state, {'rows': removeRows(state.rows, data)});
        case 'setfield':
            return nextState(state, {'rows': setField(state.config, state.rows, data)});
        default:
            //console.log(`UNKNOWN ACTION ${action}`);
            return state;
    }
}

function nextState(previousState, newStateParts) {
    let stateWasTouched = false;
    Object.keys(newStateParts).forEach(propertyName => {
        if (previousState[propertyName] !== newStateParts[propertyName])
            stateWasTouched = true;
    });

    if (stateWasTouched)
        return Object.assign({}, previousState, newStateParts);

    return previousState;
}

function addColumn(previousState, data) {
    const column = data.column;

    if (!column)
        return {};

    const columnExists = previousState.config.columns.some(c => c.name === column.name);

    if (column.name && !columnExists) {
        const config = copy(previousState.config);
        const rows = copy(previousState.rows);

        config.columns.push(copy(column));
        rows.forEach(row => {
            row[column.name] = defaultValueForColumn(column);
        });

        return {
            config,
            rows
        }
    }
    return {};
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

function moveRow(previousState, data) {
    let rowIndex = parseInt(data.rowIndex);
    if (isNaN(rowIndex) || rowIndex < 0 || rowIndex > previousState.length)
        return previousState;

    let newIndex = parseInt(data.newIndex);
    if (isNaN(newIndex) || newIndex < 0)
        return previousState;

    if (newIndex === rowIndex)
        return previousState;

    const nextState = copy(previousState);
    nextState.splice(newIndex, 0, nextState.splice(rowIndex, 1)[0]);
    return nextState;
}

function removeRows(previousState, data) {
    let start = parseInt(data.rowIndex);
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

    if (typeof data.rowIndex === 'number') {
        const rowToChange = nextState[data.rowIndex];

        if (data.columnName && typeof data.value !== 'undefined') {
            rowToChange[data.columnName] = data.value;
            return nextState;
        } else if (data.values) {
            Object.keys(data.values).forEach(columnName => {
                rowToChange[columnName] = data.values[columnName];
            });
            return nextState;
        }
    } else if (data.columnName) {
        const columnName = data.columnName;

        if (data.value) {
            nextState.forEach(row => {
                row[columnName] = data.value;
            });
            return nextState;
        } else if (data.fn && typeof data.fn === 'function') {
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
 * The constructor function that returns a new DataGrid instance based on the
 * given configuration and optionally containing some initial rows.
 *****************************************************************************/
function DataGrid(initialConfig, initialRows = []) {
    if (!initialConfig)
        return null;

    if (typeof initialConfig === 'string') {
        return fromJson(initialConfig);
    }


    const result = schemaValidator.validate(initialConfig, dataGridConfigSchema);
    if (result.errors[0]) {
        console.error('Invalid configuration: ' + result.errors[0].stack);
        return null;
    }

    const rows = initialRows.reduce((prevState, nextRow) => {
        return addRow(initialConfig, prevState, {row: nextRow});
    }, []);

    let past = [];
    let state = {
        config: copy(initialConfig),
        rows
    };
    let future = [];

    function getRedoCount() {
        return future.length;
    }

    function getState() {
        return state;
    }

    function getUndoCount() {
        return past.length;
    }

    function send(message = {}) {
        const action = message.action.toLowerCase();

        if (action === 'undo') {
            if (past.length) {
                future.unshift(state);
                state = past.pop();
            }
        } else if (action === 'redo') {
            if (future.length) {
                past.push(state);
                state = future.shift();
            }
        } else {
            past.push(state);
            state = handleMessage(state, message.action, message);
            future = [];
        }
    }

    function toJson() {
        return JSON.stringify(state);
    }

    return {
        getRedoCount,
        getRows: _ => state.rows,
        getState,
        getUndoCount,
        send,
        toJson
    };
}

function fromJson(jsonString) {
    let parsed = false;

    try {
        parsed = JSON.parse(jsonString);
    } catch (e) {
        console.log('Error deserializing DataGrid from JSON ', e);
        console.log('  bad json: ' + jsonString);
        return null;
    }

    if (typeof parsed === 'object' && parsed.config && parsed.rows) {
        return DataGrid(parsed.config, parsed.rows);
    }

    return null;
}

function copy(object) {
    return JSON.parse(JSON.stringify(object));
}

module.exports = DataGrid;
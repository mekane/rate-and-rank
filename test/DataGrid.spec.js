const deepFreeze = require('deep-freeze');
const expect = require('chai').expect;

const Validator = require('jsonschema').Validator;
const dataGridConfigSchema = require('../schema/DataGridConfig.schema.json');
const validator = new Validator();

const DataGrid = require('../src/DataGrid');

const basicConfig = {
    name: 'Basic Config',
    columns: [
        {name: 'Column A'},
        {name: 'Column B'},
        {name: 'Column C'}
    ]
};
deepFreeze(basicConfig);

function basicRows() {
    return [
        {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
        {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
        {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
        {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
    ];
}

describe('The DataGrid config schema', () => {
    function validate(config) {
        const result = validator.validate(config, dataGridConfigSchema)

        const error = result.errors[0];
        console.log(config.name + ':', error ? error.stack : ' valid');
        return !error;
    }

    it('passes valid config objects', () => {
        expect(validate(basicConfig)).to.equal(true);

        const minimalConfig = {
            name: 'Minimal Config',
            columns: [{name: 'Column'}]
        };
        expect(validate(minimalConfig)).to.equal(true);

        const fullConfig = {
            name: "Full Config",
            columns: [
                {name: "Column A", type: "string", default: "Foo"},
                {name: "column B", type: "number", default: 1},
                {name: "column C", type: "image", default: 1}
            ],
        };
        expect(validate(fullConfig)).to.equal(true);
    });

    it('rejects invalid config objects', () => {
        const missingName = {};

        const missingColumns = {
            name: 'Missing Columns'
        };

        const emptyColumns = {
            name: 'Empty Columns',
            columns: []
        };

        const missingColumnName = {
            name: 'Missing Column Name',
            columns: [{}]
        };

        const invalidColumnType = {
            name: 'Invalid Column Type',
            columns: [{name: 'Column', type: "invalid"}]
        };

        expect(validate(missingName)).to.equal(false);
        expect(validate(missingColumns)).to.equal(false);
        expect(validate(emptyColumns)).to.equal(false);
        expect(validate(missingColumnName)).to.equal(false);
        expect(validate(invalidColumnType)).to.equal(false);
    });
});

describe('The DataGrid module', () => {
    it(`is initialized with a config object and a copy of the config is available on the instance`, () => {
        const initialConfig = {
            name: 'Test',
            columns: [
                {name: 'Test 1'}
            ]
        };

        const dataGrid = DataGrid(initialConfig);
        expect(dataGrid).to.be.an('object');
        expect(dataGrid.getState().config).to.not.equal(initialConfig);
        expect(dataGrid.getState().config).to.deep.equal(initialConfig);
    });

    it(`returns null if the provided config doesn't conform to the schema`, () => {
        expect(DataGrid({})).to.equal(null);
    });

    it(`doesn't modify the config object that is passed in`, () => {
        const dataGrid = DataGrid(basicConfig);
        expect(dataGrid.getState().config).to.deep.equal(basicConfig);
    });

    it(`can be initialized with rows`, () => {
        const initialRow = {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'};
        const dataGrid = DataGrid(basicConfig, [initialRow]);

        expect(dataGrid.getRows()).to.deep.equal([initialRow]);
    });

    it(`adds default values to the initial rows`, () => {
        const config = {
            name: 'Test',
            columns: [
                {name: 'Column A'},
                {name: 'Column B', type: 'number'},
            ]
        };
        const dataGrid = DataGrid(config, [{}]);

        expect(dataGrid.getRows()).to.deep.equal([{'Column A': '', 'Column B': 0}]);
    });

    it(`returns a copy of the current row values`, () => {
        const initialRows = basicRows();
        const dataGrid = DataGrid(basicConfig, initialRows);

        expect(dataGrid.getRows()).to.not.equal(initialRows);
        expect(dataGrid.getRows()).to.deep.equal(initialRows);
    });
});

describe('Message sending strategy to manipulate the state of the grid', () => {
    it('does not modify the state if the action has no effect', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const state1 = dataGrid.getState();

        dataGrid.send({action: 'no effect'});

        const state2 = dataGrid.getState();

        expect(state1).to.equal(state2);
    });
});

describe('Removing rows', () => {
    it(`has no effect if the index is missing or out of bounds`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'removeRow'});
        dataGrid.send({action: 'removeRow', rowIndex: -1});
        dataGrid.send({action: 'removeRow', rowIndex: 99});
        dataGrid.send({action: 'removeRow', rowIndex: 'none'});

        const newState = dataGrid.getState();
        expect(newState.rows).to.be.an('array').with.length(4);
        expect(newState).to.equal(previousState);
    });

    it(`removes rows by index`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];

        dataGrid.send({action: 'removeRow', rowIndex: 1});

        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can remove multiple rows`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];

        dataGrid.send({action: 'removeRow', rowIndex: 1, count: 2});

        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });
});

describe('Adding rows', () => {
    it(`starts empty with no rows`, () => {
        const dataGrid = DataGrid(basicConfig);
        expect(dataGrid.getRows()).to.be.an('array').with.length(0);
    });

    it(`can add a new blank row with default values`, () => {
        const dataGrid = DataGrid(basicConfig);
        dataGrid.send({action: 'addRow'});

        const rows = dataGrid.getRows();
        expect(rows).to.be.an('array').with.length(1);
        expect(rows).to.deep.equal([{'Column A': '', 'Column B': '', 'Column C': ''}]);
    });

    it(`assigns default value based on configured column type`, () => {
        const numericColumnConfig = {
            name: 'Test',
            columns: [{name: 'Column A', type: 'number'}]
        };
        const dataGrid = DataGrid(numericColumnConfig);
        dataGrid.send({action: 'addRow'});

        expect(dataGrid.getRows()).to.deep.equal([{'Column A': 0}]);
    });

    it('assigns default values to the new row if configured', () => {
        const numericColumnConfig = {
            name: 'Test',
            columns: [
                {name: 'Column A', type: 'string', default: 'empty'},
                {name: 'Column B', type: 'number', default: 666}
            ]
        };
        const dataGrid = DataGrid(numericColumnConfig);
        dataGrid.send({action: 'addRow'});
        dataGrid.send({action: 'addRow'});

        const expectedRows = [
            {'Column A': 'empty', 'Column B': 666},
            {'Column A': 'empty', 'Column B': 666}
        ];

        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can add a new row with initial values`, () => {
        const dataGrid = DataGrid(basicConfig);
        dataGrid.send({action: 'addRow', row: {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'}})

        const rows = dataGrid.getRows();
        expect(rows).to.be.an('array').with.length(1);
        expect(rows).to.deep.equal([{'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'}]);
    });
});

describe('Modifying rows', () => {
    it(`can change the value of a single field on a single row`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const action = {action: 'setField', rowIndex: 1, columnName: 'Column A', value: 'New Value'};
        dataGrid.send(action);

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'New Value', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`works correctly for row index 0`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const action = {action: 'setField', rowIndex: 0, columnName: 'Column A', value: 'New Value'};
        dataGrid.send(action);

        const expectedRows = [
            {'Column A': 'New Value', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can change the value of multiple fields on a single row`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const action = {
            action: 'setField',
            rowIndex: 1,
            values: {'Column A': 'New Value A', 'Column B': 'New Value B'}
        };
        dataGrid.send(action);

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'New Value A', 'Column B': 'New Value B', 'Column C': 'C1'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can set the value of one field on all the columns`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const action = {action: 'setField', columnName: 'Column A', value: 'New A'};
        dataGrid.send(action);

        const expectedRows = [
            {'Column A': 'New A', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'New A', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'New A', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'New A', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can apply a function to a field on all columns`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        function doubleIndex(oldValue, rowIndex, columnConfig) {
            return 'New A' + (rowIndex * 2);
        }

        const action = {action: 'setField', columnName: 'Column A', fn: doubleIndex};
        dataGrid.send(action);

        const expectedRows = [
            {'Column A': 'New A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'New A2', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'New A4', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'New A6', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it('has no effect if a valid field specifier is not present', () => {
        //Valid specifiers:
        //rowIndex + columnName + value
        //rowIndex + values
        //columnName + value
        //columnName + fn

        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'setField'}); //nothing
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', rowIndex: 1}); //no columnName or value
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', rowIndex: 1, columnName: 'Column A'}); //no value
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', value: 'New A'}); // no rowIndex or columnName
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', values: {'Column A': 'New A'}}); // no columnName
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', columnName: 'Column A'}); // no values or fn
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'setField', fn: (a, b, c) => 'whatever'});
        expect(dataGrid.getState()).to.equal(previousState);
    })
});

describe('Reordering rows', () => {
    it(`has no effect if the row index or new index are missing or bad`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'moveRow'}); //nothing
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'moveRow', rowIndex: 1}); //no new index
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'moveRow', rowIndex: -1}); //bad row index
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'moveRow', rowIndex: 99}); //non-existant row index
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'moveRow', newIndex: 1}); //no row index
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'moveRow', rowIndex: 0, newIndex: -1}); //bad new index
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it(`has no effect if the row index and new index are identical`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'moveRow', rowIndex: 1, newIndex: 1});
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('can move a row to a different spot in the list', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows1 = [
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];
        dataGrid.send({action: 'moveRow', rowIndex: 2, newIndex: 0});
        expect(dataGrid.getState().rows).to.deep.equal(expectedRows1);

        const expectedRows2 = [
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'},
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'}
        ];
        dataGrid.send({action: 'moveRow', rowIndex: 1, newIndex: 3});
        expect(dataGrid.getState().rows).to.deep.equal(expectedRows2);
    });

    it(`just moves the row to the end of the list if the newIndex is higher than max rows`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows = [
            {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'},
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'}
        ];
        dataGrid.send({action: 'moveRow', rowIndex: 0, newIndex: 99});
        expect(dataGrid.getState().rows).to.deep.equal(expectedRows);
    });
});

describe('Adding columns via the config', () => {
    it('has no effect if the named column already exists', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'addColumn', column: {name: 'Column A'}});
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('has no effect without at least a name', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'addColumn'});
        expect(dataGrid.getState()).to.equal(previousState);

        dataGrid.send({action: 'addColumn', column: {}});
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('can add a column which adds default values to all the rows', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const column = {name: 'Column D', type: 'string', default: 'new D'};
        dataGrid.send({action: 'addColumn', column});

        const expectedColumnConfig = [
            {name: 'Column A'},
            {name: 'Column B'},
            {name: 'Column C'},
            {name: 'Column D', type: 'string', default: 'new D'}
        ];
        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0', 'Column D': 'new D'},
            {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1', 'Column D': 'new D'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2', 'Column D': 'new D'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3', 'Column D': 'new D'}
        ];
        expect(dataGrid.getState().config.columns).to.deep.equal(expectedColumnConfig);
        expect(dataGrid.getState().rows).to.deep.equal(expectedRows);
    });

    it('can be undone', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        const column = {name: 'Column D', type: 'string', default: 'new D'};
        dataGrid.send({action: 'addColumn', column});
        dataGrid.send({action: 'undo'});

        expect(dataGrid.getState()).to.equal(previousState);
    });
});

describe.skip('Removing columns', () => {
    it('can remove a column');

    it('can change the type of a column');

    it('can change the default value of a column');
});

describe('Undo and Redo', () => {
    it('keeps an undo history', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        expect(dataGrid.getUndoCount()).to.equal(0);

        dataGrid.send({action: 'addRow'});

        expect(dataGrid.getUndoCount()).to.equal(1);
    });

    it('restores the previous state when an "undo" action is sent', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'addRow'});
        const nextState = dataGrid.getState();
        expect(nextState).to.not.equal(previousState);

        dataGrid.send({action: 'undo'});
        const restoredState = dataGrid.getState();
        expect(restoredState).to.equal(previousState);
    });

    it('has no effect if there are no more history states to restore', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const previousState = dataGrid.getState();

        dataGrid.send({action: 'addRow'});

        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});

        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('keeps a redo future history', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        expect(dataGrid.getRedoCount()).to.equal(0);

        dataGrid.send({action: 'addRow'});
        dataGrid.send({action: 'undo'});

        expect(dataGrid.getRedoCount()).to.equal(1);
    });


    it('restores the previously undone state when a "redo" action is sent', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        dataGrid.send({action: 'addRow'});

        const previousState = dataGrid.getState();

        dataGrid.send({action: 'undo'});
        expect(dataGrid.getState()).to.not.equal(previousState);

        dataGrid.send({action: 'redo'});
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('has no effect if there are no more history states to restore', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        dataGrid.send({action: 'addRow'});

        const previousState = dataGrid.getState();

        dataGrid.send({action: 'undo'});
        expect(dataGrid.getState()).to.not.equal(previousState);

        dataGrid.send({action: 'redo'});
        dataGrid.send({action: 'redo'});
        dataGrid.send({action: 'redo'});
        dataGrid.send({action: 'redo'});
        dataGrid.send({action: 'redo'});
        dataGrid.send({action: 'redo'});
        expect(dataGrid.getState()).to.equal(previousState);
    });

    it('discards the future when a new action is done', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        dataGrid.send({action: 'addRow'});
        dataGrid.send({action: 'addRow'});
        dataGrid.send({action: 'addRow'});
        expect(dataGrid.getRedoCount()).to.equal(0);

        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        dataGrid.send({action: 'undo'});
        expect(dataGrid.getRedoCount()).to.equal(3);

        dataGrid.send({action: 'addRow'});
        expect(dataGrid.getRedoCount()).to.equal(0);
    });
});

describe('Serialize to JSON', () => {
    it('has a serialize method that returns a JSON string suitable for persisting the grid', () => {
        const dataGrid = DataGrid({
                name: 'test',
                columns: [{name: 'col1'}]
            },
            [{col1: 1}]);
        dataGrid.send({action: 'addRow', row: {col1: 2}});

        const expectedString = '{"config":{"name":"test","columns":[{"name":"col1"}]},"rows":[{"col1":1},{"col1":2}]}';
        expect(dataGrid.toJson()).to.equal(expectedString);
    });
});

describe('Unserialize from JSON', () => {
    it('returns null if trying to unserialize from bogus data', () => {
        expect(DataGrid()).to.equal(null);
        expect(DataGrid('')).to.equal(null);
        expect(DataGrid([])).to.equal(null);
        expect(DataGrid({})).to.equal(null);
    });

    it('initializes a DataGrid from the previously serialized JSON string, if valid', () => {
        const jsonString = '{"config":{"name":"test","columns":[{"name":"col1"}]},"rows":[{"col1":1},{"col1":2}]}';
        const dataGrid = DataGrid(jsonString);

        const expectedState = {
            config: {
                name: 'test',
                columns: [
                    {name: 'col1'}
                ]
            },
            rows: [
                {col1: 1},
                {col1: 2}
            ]
        };
        expect(dataGrid.getState()).to.deep.equal(expectedState);
    })
});
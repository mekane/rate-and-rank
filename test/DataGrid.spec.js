const deepFreeze = require('deep-freeze');
const expect = require('chai').expect;

const DataGrid = require('../src/DataGrid');

const basicConfig = {
    name: 'Test',
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
        expect(dataGrid.getInitialConfig()).to.not.equal(initialConfig);
        expect(dataGrid.getInitialConfig()).to.deep.equal(initialConfig);
    });

    it(`doesn't modify the config object that is passed in`, () => {
        const dataGrid = DataGrid(basicConfig);
        expect(dataGrid.getInitialConfig()).to.deep.equal(basicConfig);
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

    it('uses a message sending strategy to manipulate the state of the grid', () => {
        const dataGrid = DataGrid(basicConfig, basicRows());
        const rows1 = dataGrid.getRows();

        dataGrid.send({action: 'test'});

        const rows2 = dataGrid.getRows();

        expect(rows1).to.not.equal(rows2);
    });
});

describe('Removing rows', () => {
    it(`has no effect if the index is missing or out of bounds`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        dataGrid.send({action: 'removeRow'});
        dataGrid.send({action: 'removeRow', index: -1});
        dataGrid.send({action: 'removeRow', index: 99});
        dataGrid.send({action: 'removeRow', index: 'none'});

        expect(dataGrid.getRows()).to.be.an('array').with.length(4);
    });

    it(`removes rows by index`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];

        dataGrid.send({action: 'removeRow', index: 1});

        expect(dataGrid.getRows()).to.deep.equal(expectedRows);
    });

    it(`can remove multiple rows`, () => {
        const dataGrid = DataGrid(basicConfig, basicRows());

        const expectedRows = [
            {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
            {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
        ];

        dataGrid.send({action: 'removeRow', index: 1, count: 2});

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
    it(`can change the value of a single field on a single row`);

    it(`can change the value of multiple fields on a single row`);

    it(`can set the value of one field on all the columns`);

    it(`can apply a function to a field on all columns`);
});

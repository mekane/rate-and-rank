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
        const dataGrid = DataGrid(basicConfig, basicRows());
        expect(dataGrid).to.be.an('object');
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

describe('Adding rows', () => {
    it(`starts empty with no rows`, () => {
        const dataGrid = DataGrid(basicConfig);
    });

    it(`can add a new blank row`);

    it(`can add a new row with initial values`);
});

describe('Modifying rows', () => {
    it(`can change the value of a single field on a single row`);

    it(`can change the value of multiple fields on a single row`);

    it(`can set the value of one field on all the columns`);

    it(`can apply a function to a field on all columns`);
});

describe('Removing rows', () => {
    it(`removes rows by index`);

    it(`can remove multiple rows`, () => {
        //const dataGrid = DataGrid(basicConfig, basicRows());
        //dataGrid.send('remove', {start: 1, count: 2})
    });
});
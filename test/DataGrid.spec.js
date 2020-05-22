const deepFreeze = require('deep-freeze');
const expect = require('chai').expect;

const DataGrid = require('../src/DataGrid');

describe('The DataGrid module', () => {
    it(`is initialized with a config object and a copy of the config is available on the instance`, () => {
        const initialConfig = {
            name: 'Test',
            columns: [
                { name: 'Test 1' }
            ]
        };

        const dataGrid = DataGrid(initialConfig);
        expect(dataGrid).to.be.an('object');
        expect(dataGrid.getInitialConfig()).to.not.equal(initialConfig);
        expect(dataGrid.getInitialConfig()).to.deep.equal(initialConfig);
    });
});
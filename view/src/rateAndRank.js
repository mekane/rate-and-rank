/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
import DataGrid from "../../src/DataGrid";
import waitForDocumentReady from "./documentReady";

const config = {
    name: 'Test Grid',
    columns: [
        {name: 'Column A'},
        {name: 'Column B'},
        {name: 'Column C'}
    ]
};

const data = [
    {'Column A': 'A0', 'Column B': 'B0', 'Column C': 'C0'},
    {'Column A': 'A1', 'Column B': 'B1', 'Column C': 'C1'},
    {'Column A': 'A2', 'Column B': 'B2', 'Column C': 'C2'},
    {'Column A': 'A3', 'Column B': 'B3', 'Column C': 'C3'}
];

waitForDocumentReady(document)
    .then(loadInitialData)
    .then(initializeRateAndRankApp);

function loadInitialData(readyMsg) {
    //console.log(`Debug ${readyMsg}`);

    return {
        config,
        data
    };
}

function initializeRateAndRankApp(init) {
    const dataGrid = DataGrid(init.config, init.data);

    function action(action, data) {
        const msg = {action, ...data};
        console.log('send', msg);
        dataGrid.send(msg);
        render(dataGrid.getState());
    }

    window.action = action;

    render(dataGrid.getState(), action);
}

function render(nextState, action) {
    document.querySelector('body').innerHTML = '<pre>' + JSON.stringify(nextState) + '</pre>';
    console.log('render', nextState);
}

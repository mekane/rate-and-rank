/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
import DataGrid from "../../src/DataGrid";
import waitForDocumentReady from "./documentReady";

const snabbdom = require('snabbdom');
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);

import {DataGrid as DataGridView} from './DataGrid';


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

    const action = {
        data: (action, options) => {
            const msg = {action, ...options};
            console.log('send', msg);
            dataGrid.send(msg);
            render(dataGrid.getState());
        },
        ui: handleActionForUI
    }

    window.action = action; //XXX for testing - to enable manual actions in the console

    render(dataGrid.getState(), action);
}

function handleActionForUI(action, event, options) {
    if (action === 'makeEditable') {
        console.log('make editable', options);
    }
}

let vnode = document.querySelector('main');

function render(nextState, action) {
    console.log('render state', nextState);
    const nextView = DataGridView(nextState, action);
    console.log('rendered view', nextView);

    vnode = patch(vnode, nextView);
}

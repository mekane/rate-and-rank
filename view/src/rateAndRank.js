/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
import DataGrid from "../../src/DataGrid";
import waitForDocumentReady from "./documentReady";

const snabbdom = require('snabbdom');
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default, // makes it easy to toggle classes
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);

import {Grid as GridView} from './Grid';

const config = {
    name: 'Test Grid',
    columns: [
        {name: 'Column A'},
        {name: 'Column B', type: 'number'},
        {name: 'Column C'}
    ]
};

const data = [
    {'Column A': 'A0', 'Column B': '10', 'Column C': 'C0'},
    {'Column A': 'A1', 'Column B': '11', 'Column C': 'C1'},
    {'Column A': 'A2', 'Column B': '12', 'Column C': 'C2'},
    {'Column A': 'A3', 'Column B': '13', 'Column C': 'C3'}
];

//The root virtual node that the render function hooks into
let vnode = document.querySelector('main');

let action = _ => _;

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

    action = msg => {
        console.log(msg);
        dataGrid.send(msg);
        render(dataGrid.getState(), action);
    };
    window.action = action; //use global to avoid passing this down to every last component

    initializeAppLevelEvents();

    render(dataGrid.getState(), action);
}

function initializeAppLevelEvents() {
    const body = document.querySelector('body');
    body.addEventListener('keyup', e => {
        let key = e.key;

        if (e.ctrlKey)
            key = `ctrl+${key}`;

        switch (key) {
            case "ctrl+z":
                undo();
                break;
            case "ctrl+Z":
                redo();
                break;
        }
    });
}

function render(nextState, action) {
    console.log('render state', nextState);
    const nextView = GridView(nextState, action);
    console.log('rendered view', nextView);

    vnode = patch(vnode, nextView);
}

function undo() {
    action({action: 'undo'});
}

function redo() {
    action({action: 'redo'});
}
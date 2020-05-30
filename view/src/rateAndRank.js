/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
import DataGrid from "../../src/DataGrid";
import waitForDocumentReady from "./documentReady";

const snabbdom = require('snabbdom');
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default
]);

import {Grid as GridView} from './Grid';

const config = {
    name: 'Test Grid',
    columns: [
        {name: 'Column A'},
        {name: 'Column B', type: 'number'},
        {name: 'Column C', type: 'image'}
    ]
};

const smiley = 'data:image/png;base64,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';

const data = [
    {'Column A': 'A0', 'Column B': '10', 'Column C': ''},
    {'Column A': 'A1', 'Column B': '11', 'Column C': ''},
    {'Column A': 'A2', 'Column B': '12', 'Column C': smiley},
    {'Column A': 'A3', 'Column B': '13', 'Column C': ''}
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
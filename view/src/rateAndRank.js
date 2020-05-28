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

    const action = {};
    action.data = (actionData) => {
        console.log(actionData);
        dataGrid.send(actionData);
        render(dataGrid.getState(), action);
    };
    action.ui = handleActionForUI;

    window.action = action; //XXX for testing - to enable manual actions in the console

    render(dataGrid.getState(), action);
}

//TODO: could move all this stuff into a separate GridCell module
function handleActionForUI(action, event, options) {
    const column = options.column || {};
    const actionData = {
        rowIndex: options.row,
        columnName: options.column.name
    };

    if (action === 'makeEditable') {
        if (column.isRankColumn) {
            console.log('Edit rank');
            editNumber(event.target, {action: 'moveRow', ...actionData});
        }
        else if (column.name === 'number') {
            editNumber(event.target, {action: 'setField', ...actionData});
        }
        else {
            editText(event.target, {action: 'setField', ...actionData});
        }
    }
}

function editText(element, actionData) {
    const originalValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalValue;

    function submit() {
        actionData.value = input.value;
        console.log('submit ', actionData);
        //input.blur();
        action.data(actionData);
    }

    function cancel() {
        input.remove();
        element.innerHTML = originalValue;
    }

    //render()
    element.innerHTML = '';
    element.append(input);
    input.select();

    input.addEventListener('blur', cancel);
    input.addEventListener('keyup', e => {
        switch (e.key) {
            case "Enter":
                submit();
                break;
            case "Esc":
            case "Escape":
                input.blur();
                break;
            default:
                return;
        }
    });
}

function editNumber(element, actionData) {
    console.log('Edit number', element, actionData);
}


let vnode = document.querySelector('main');

function render(nextState, action) {
    console.log('render state', nextState);
    const nextView = GridView(nextState, action);
    console.log('rendered view', nextView);

    vnode = patch(vnode, nextView);
}

/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
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

/**
 * vNode - root virtual node that the render function hooks into
 * actionDispatcher - the module that will send actions and notify the subscribed callback of new states
 */
export default function DataGridView(vNode, actionDispatcher) {
    let vnode = vNode;
    window.action = actionDispatcher.send; //use global to avoid passing this down to every last component
    actionDispatcher.subscribe(render);

    waitForDocumentReady(document)
        .then(initializeAppLevelEvents)
        .then(actionDispatcher.send({action: 'refresh'}));

    function render(nextState) {
        console.log('Got new state from action module', nextState);
        const nextView = GridView(nextState);
        vnode = patch(vnode, nextView);
    }
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

    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = 'Rate and Rank';
    });
}

function undo() {
    action({action: 'undo'});
}

function redo() {
    action({action: 'redo'});
}

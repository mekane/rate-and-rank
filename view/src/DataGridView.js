/**
 * The "main" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering
 */
import waitForDocumentReady from "./documentReady";

const snabbdom = require('snabbdom');
const toVNode = require('snabbdom/tovnode').default;
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default
]);

import {Grid as GridView} from './Grid';

/**
 * attachElement - root virtual node that the render function hooks into
 * actionDispatcher - the module that will send actions and notify the subscribed callback of new states
 */
export default function DataGridView(attachElement, actionDispatcher) {
    let vnode = toVNode(attachElement);

    /* The action dispatcher that we pass to the component is wrapped in this,
     * which will add global undo records each time we do an action. Note that
     * the 'undo' action it sends is not wrapped, so it shouldn't generate an
     * additional undo record!
     *
     * This setup depends on the DataGrid always adding a new state to history
     * when it gets an action message, even if it didn't modify the state.
     */
    const actionDispatch = function(actionData) {
        actionDispatcher.send(actionData);
        addGlobalUndoEntry(actionDispatcher);
    }
    actionDispatcher.subscribe(render);

    waitForDocumentReady(document)
        .then(actionDispatcher.send({action: 'refresh'}));

    function render(nextState) {
        //console.log('Got new state from actionDispatcher module', nextState);
        const nextView = GridView(nextState, actionDispatch);
        vnode = patch(vnode, nextView);
    }
}

function addGlobalUndoEntry(actionDispatcher) {
    const command = {
        undo: _ => actionDispatcher.send({action: 'undo'}),
        redo: _ => actionDispatcher.send({action: 'redo'})
    }

    window.dataGridUndos.push(command);
    window.dataGridRedos = [];
}

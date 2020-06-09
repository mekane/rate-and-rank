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
    const actionDispatch = actionDispatcher.send;
    actionDispatcher.subscribe(render);

    waitForDocumentReady(document)
        .then(actionDispatcher.send({action: 'refresh'}));

    function render(nextState) {
        console.log('Got new state from actionDispatcher module', nextState);
        const nextView = GridView(nextState, actionDispatch);
        vnode = patch(vnode, nextView);
    }
}

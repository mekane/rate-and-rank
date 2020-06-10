import JsonApiActionDispatcher from './src/JsonApiActionDispatcher';
import DataGridView from './src/DataGridView';
import initializeGlobalGridControls from "./src/globalGridControls";

export function initGrid(selector, actionUrl) {
    const el = document.querySelector(selector);
    const apiActionDispatcher = JsonApiActionDispatcher(actionUrl);
    DataGridView(el, apiActionDispatcher);
    console.log('DataGrid initialized on element ' + selector);
}

initializeGlobalGridControls();
/* Note for later: this now causes the undo history to disappear on page
 * refresh since the global lists on the window are empty;
 * Could it work to always try dispatching an undo action?
 */

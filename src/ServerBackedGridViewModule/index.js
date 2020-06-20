/**
 * This is the "main" entry point for putting together a module that will init
 * a DataGrid view that gets and persists its data server-side, using an API.
 * This is the "real" view module for grids in user accounts.
 */
import JsonApiActionDispatcher from './JsonApiActionDispatcher';
import DataGridView from '../GridView';
import initializeGlobalGridControls from "../GridView/globalGridControls";

export function initGrid(selector, actionUrl, getStateUrl) {
    const el = document.querySelector(selector);
    const apiActionDispatcher = JsonApiActionDispatcher(actionUrl, getStateUrl);
    DataGridView(el, apiActionDispatcher);
    console.log('DataGrid initialized on element ' + selector);
}

/**
 * The script that this gets bundled into should be included in the web page with a script tag,
 * so the below function should get initialized exactly once per page.
 */
initializeGlobalGridControls();

/**
 * This is the "main" entry point for putting together a module that will init
 * a DataGrid view that runs entirely in memory in a browser tab.
 * Mainly meant for the non-persistent demos.
 */
import InMemoryDataGridActionDispatcher from './InMemoryDataGridActionDispatcher';
import DataGridView from "../GridView";
import initializeGlobalGridControls from '../GridView/globalGridControls';

export function initGrid(selector, config, rows) {
    const el = document.querySelector(selector);
    const actionDispatcher = InMemoryDataGridActionDispatcher(config, rows);
    DataGridView(el, actionDispatcher);
    console.log('DataGrid initialized on element ' + selector);
}

/**
 * The script that this gets bundled into should be included in the web page with a script tag,
 * so the below function should get initialized exactly once per page.
 */
initializeGlobalGridControls();

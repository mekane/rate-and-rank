import InMemoryDataGridActionDispatcher from './src/InMemoryDataGridActionDispatcher';
import DataGridView from "./src/DataGridView";
import initializeGlobalGridControls from './src/globalGridControls';

export function initGrid(selector, config, rows) {
    const el = document.querySelector(selector);
    const actionDispatcher = InMemoryDataGridActionDispatcher(config, rows);
    DataGridView(el, actionDispatcher);
    console.log('DataGrid initialized on element ' + selector);
}

initializeGlobalGridControls();

import JsonApiActionDispatcher from './src/JsonApiActionDispatcher';
import DataGridView from './src/DataGridView';

export function initGrid(selector, actionUrl) {
    const el = document.querySelector(selector);
    const apiActionDispatcher = JsonApiActionDispatcher(actionUrl);
    DataGridView(el, apiActionDispatcher);
    console.log('DataGrid initialized on element ' + selector, el);
}

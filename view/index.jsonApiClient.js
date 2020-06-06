import JsonApiActionDispatcher from './src/JsonApiActionDispatcher';
import DataGridView from './src/DataGridView';

export function initGrid(selector, actionUrl) {
    const apiActionDispatcher = JsonApiActionDispatcher(actionUrl);
    console.log('json api client app loaded');
    const el = document.querySelector(selector);

    console.log('init on element ' + selector, el);
    DataGridView(el, apiActionDispatcher);
}
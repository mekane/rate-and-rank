import InMemoryDataGridActionDispatcher from './src/InMemoryDataGridActionDispatcher';
import DataGridView from "./src/DataGridView";

export function initGrid(selector, config, rows) {
    const el = document.querySelector(selector);
    const actionDispatcher = InMemoryDataGridActionDispatcher(config, rows);
    DataGridView(el, actionDispatcher);
    console.log('DataGrid initialized on element ' + selector);
}

/* Need to figure out how to handle key event for undo/redo
 * A) Figure out how to listen for keypresses on .grid elements
 * B) Have a global (one-per-window) queue of undo Command objects and just
 *    eval them. Each action dispatcher would just have to push an Undo Command
 *    onto this stack with a reference to itself each time. But then when
 *    an 'undo' was executed it would need to push a 'redo' onto the front of
 *    the redo queue with the same dispatcher. That part seems tricky.
 * C) Only worry about ctrl+z on screens where we know there's just one grid (bad option)
 *
function handleKeys(actionDispatch, e) {
    console.log('Handle keys', e);
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

    function undo() {
        actionDispatch({action: 'undo'});
    }

    function redo() {
        actionDispatch({action: 'redo'});
    }
}
 */
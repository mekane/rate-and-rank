//The component view for a DataGrid
import {getGridRowStyles} from "./viewHelpers";
import {Row} from './Row';

const h = require('snabbdom/h').default;

export function Grid(state, actionDispatch) {
    const columns = state.config.columns;

    const data = {
        on: {
            dragenter: allowAndIgnoreDrops,
            dragover: allowAndIgnoreDrops,
            drop: allowAndIgnoreDrops
        }
    };

    const title = h('div.title', state.config.name);
    const headerRow = getColumnHeaders(columns);
    const rows = state.rows.map((row, i) => Row(row, i, columns, actionDispatch));
    const controls = makeControls(actionDispatch);
    const children = [title, headerRow].concat(rows).concat(controls);

    return h('div.grid', data, children);


    function getColumnHeaders(columns) {
        const style = getGridRowStyles(columns.length);

        const rankHeader = gridColumnHeader({name: 'Rank', type: 'number'});
        const headerItems = [rankHeader].concat(columns.map(gridColumnHeader));

        return h('div.column-header-row', {style}, headerItems);
    }

    function gridColumnHeader(column) {
        return h('div.grid-column-header', column.name);
    }
}

function makeControls(actionDispatch) {
    const controls = [
        makeAddRow(actionDispatch),
        //makeUndoButton(actionDispatch),
        //makeRedoButton(actionDispatch)
    ];
    return h('div.controls', {}, controls);
}

function makeAddRow(actionDispatch) {
    const data = {
        on: {
            click: e => actionDispatch({action: 'addRow'})
        }
    };
    return h('button.add-row', data, '+ Add Row');
}
/* Note: undo and redo here are commented out because these "local" undo/redo
   actions would conflict with the global undo/redo action handler and would
   cause this grid to get out of sync with the local one.

function makeUndoButton(actionDispatch) {
    const data = {
        on: {
            click: e => actionDispatch({action: 'undo'})
        }
    };
    return h('button.undo', data, 'Undo');
}

function makeRedoButton(actionDispatch) {
    const data = {
        on: {
            click: e => actionDispatch({action: 'redo'})
        }
    };
    return h('button.redo', data, 'Redo');
}
*/
/**
 * This indicates that dropping is allowed anywhere in the grid.
 * We use this to capture image drops from outside the browser
 * that go astray and don't land on an image drop target because
 * otherwise those cause the tab to load the image and replace the page.
 * (I couldn't find any info about how to prevent that and all of my
 * event experiments failed to have any effect). I do have a warning
 * before page onload at least.
 * Note that this has a side effect of also allowing pretty much
 * anything to be dropped on rows, so we needed to add a little bit
 * of extra validation in the Row drop event handler to make sure it
 * only handles valid row drops.
 */
function allowAndIgnoreDrops(e) {
    e.preventDefault();
    e.stopPropagation();
}
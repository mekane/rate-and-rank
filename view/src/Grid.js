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
        makeRemoveRow(actionDispatch)
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

function makeRemoveRow(actionDispatch) {
    const data = {
        on: {
            dragenter: allowRowDrops,
            dragover: allowRowDrops,
            dragleave: dragLeave,
            drop: [rowDropped, actionDispatch]
        }
    };
    return h('div.remove-row', data, 'Drop Here to Remove Row');
}

//TODO: refactor out duplicated code
function allowRowDrops(event) {
    if (couldDropRowHere(event.dataTransfer)) {
        event.preventDefault();
        event.currentTarget.classList.add('drophighlight');
    }
}

const rowDataType = 'text/actionjson';

function couldDropRowHere(dt) {
    return (dt.effectAllowed === 'move' && dt.types.includes(rowDataType));
}

function dragLeave(event) {
    event.currentTarget.classList.remove('drophighlight');
}

function rowDropped(actionDispatch, event) {
    console.log('row dropped', event);

    event.preventDefault();

    const el = event.currentTarget;

    el.classList.remove('drophighlight');

    //TODO: put this repeated code in a function
    const gridContainer = el.closest('.grid');
    gridContainer.classList.remove('drag-active');

    const droppedRow = getDraggingRowFromData(event);
    const removeRow = {action: 'removerow', rowIndex: droppedRow.rowIndex};
    console.log('remove', removeRow);
    actionDispatch(removeRow);
}

function getDraggingRowFromData(event) {
    const dataString = event.dataTransfer.getData(rowDataType);

    if (dataString === '')
        return {}; //ignore non-row drops

    let moveRow = {};

    try {
        moveRow = JSON.parse(dataString);
    } catch (err) {
        console.log('Error processing row drop ' + err);
    }

    return moveRow;
}

// -------- duplicate code -----------

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
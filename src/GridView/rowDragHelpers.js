/**
 * Similar to viewHelpers, but specifically for handling the browser event behavior drag-and-dropping rows
 */

const rowDataType = 'text/actionjson';

export function initDataTransfer(dt, rowData) {
    dt.setData(rowDataType, rowData);
    dt.effectAllowed = 'move';

}

export function getDraggingRowFromData(event) {
    const dataString = event.dataTransfer.getData(rowDataType);

    if (dataString === '')
        return {}; //ignore non-row drops

    //TODO: does this fire a bogus event if we return this?
    let moveRow = {};

    try {
        moveRow = JSON.parse(dataString);
    } catch (err) {
        console.log('Error processing row drop ' + err);
    }

    return moveRow;
}

export function allowRowDrops(event) {
    if (couldDropRowHere(event.dataTransfer)) {
        event.preventDefault();
        event.currentTarget.classList.add('drophighlight');
    }
}

function couldDropRowHere(dt) {
    return (dt.effectAllowed === 'move' && dt.types.includes(rowDataType));
}

export function addActiveDragClassToParentGrid(el) {
    const gridContainer = el.closest('.grid');
    gridContainer.classList.add('drag-active');
}

export function removeActiveDragClassFromParentGrid(el) {
    const gridContainer = el.closest('.grid');
    gridContainer.classList.remove('drag-active');
}

export function dragLeave(event) {
    //TODO: research currentTarget vs. target
    const el = event.currentTarget;
    el.classList.remove('drophighlight');
}

export function dragEnded(event) {
    console.log('row drag ended');
    const el = event.currentTarget;
    removeActiveDragClassFromParentGrid(el);
}
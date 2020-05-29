const htmlHelpers = require('../../src/htmlHelpers');

export function getGridCellClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}

export function getGridRowStyles(numberOfColumns) {
    return {
        'grid-template-columns': `repeat(${numberOfColumns + 1}, 1fr)`
    }
}

export function preventTab(e) {
    if (e.key === "Tab")
        e.preventDefault();
}

/**
 * This assumes the key event is coming from an input field inside a grid cell
 * @param e
 */
export function tabToNextCell(e) {
    const currentGridCell = e.currentTarget.parentElement;

    let nextEl;
    if (e.shiftKey)
        nextEl = getPreviousGridCell(currentGridCell);
    else
        nextEl = getNextGridCell(currentGridCell);

    //console.log('next cell ' + (!!nextEl), nextEl);

    if (!!nextEl)
        nextEl.click();
}

function getPreviousGridCell(el) {
    let prevCell;

    if (el.classList.contains('grid-cell')) {
        prevCell = el.previousSibling;
        console.log('previous cell', prevCell);

        if (prevCell)
            return prevCell
        //else go up and back a row to find the last cell of the previous row
        const row = el.parentElement;
        const prevRow = row.previousSibling;

        if (prevRow) {
            const lastCell = prevRow.querySelector('.grid-cell:last-child');
            if (lastCell)
                return lastCell;
        }
    }
}

function getNextGridCell(el) {
    let nextCell;

    if (el.classList.contains('grid-cell')) {
        nextCell = el.nextSibling;
        console.log('next cell', nextCell);

        if (nextCell)
            return nextCell
        //else go up and over a row to find the first cell of the next row
        const row = el.parentElement;
        const nextRow = row.nextSibling;

        if (nextRow) {
            const firstCell = nextRow.querySelector('.grid-cell');
            if (firstCell)
                return firstCell;
        }
    }
}
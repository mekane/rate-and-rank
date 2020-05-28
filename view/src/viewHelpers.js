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
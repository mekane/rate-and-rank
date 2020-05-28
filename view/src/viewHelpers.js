const htmlHelpers = require('../../src/htmlHelpers');

export function getGridCellClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}
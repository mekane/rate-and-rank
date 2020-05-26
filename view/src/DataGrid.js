//The component view for a DataGrid
const h = require('snabbdom/h').default; // helper function for creating vnodes

export function DataGrid(data, action) {
    const columns = data.config.columns;
    const rows = data.rows;

    const columnItems = getColumnHeaders(columns);
    const rowItems = getRowItems(rows, columns);

    const numberOfColumns = columns.length + 1;

    return gridContainer(numberOfColumns, columnItems.concat(rowItems));
}

function gridContainer(numberOfColumns, children) {
    const style = {
        'grid-template-columns': `repeat(${numberOfColumns}, 1fr)`
    }
    return h('div.grid', {style}, children);
}

function getColumnHeaders(columns) {
    const rankHeader = gridColumnHeader({name: 'Rank', type: 'number'});

    return [rankHeader].concat(columns.map(gridColumnHeader));
}

function gridColumnHeader(column) {
    return h('div.grid-column-header', column.name);
}

function getRowItems(rows, columns) {
    return rows.flatMap((row, i) => itemsForRow(row, i));

    function itemsForRow(row, i) {
        const rankItem = h('div.grid-cell', i + 1);
        return [rankItem].concat(columns.map(column => rowContentForColumn(column, row)));
    }
}

function rowContentForColumn(column, row) {
    return h('div.grid-cell', row[column.name]);
}

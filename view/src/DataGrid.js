//The component view for a DataGrid
const h = require('snabbdom/h').default; // helper function for creating vnodes

const gridHeader = columns =>
    h('div.grid-header', columns.map(gridColumnHeader))

const gridColumnHeader = column =>
    h('div.grid-header__column', column.name)

const rowContentForColumn = (column, row) =>
    h('div.grid-body__grid-row-cell', row[column.name])

export function DataGrid(data, action) {
    const columns = data.config.columns;
    const rows = data.rows;

    const gridRows = rows =>
        h('div.grid-body', rows.map(gridRow))

    const gridRow = row =>
        h('div.grid-body__grid-row', columns.map(column => rowContentForColumn(column, row)))

    return h('div.data-grid', [
        gridHeader(columns),
        gridRows(rows)
    ]);
}

//The component view for a DataGrid
const h = require('snabbdom/h').default; // helper function for creating vnodes
const htmlHelpers = require('../../src/htmlHelpers');

const __rankColumn = {
    name: '__rank_column',
    type: 'number'
}

export function DataGrid(data, action) {
    const columns = data.config.columns;
    const rows = data.rows;

    const columnItems = getColumnHeaders(columns);
    const rowItems = getRowItems(rows, columns);

    const numberOfColumns = columns.length + 1;

    return gridContainer(numberOfColumns, columnItems.concat(rowItems));


    function getRowItems(rows, columns) {
        return rows.flatMap((row, i) => itemsForRow(row, i));

        function itemsForRow(row, i) {
            const rowNumber = i + 1;
            const rankItem = rowContentForColumn(__rankColumn, row, i);
            const rowItems = columns.map(column => rowContentForColumn(column, row, i));
            return [rankItem].concat(rowItems);
        }
    }

    function rowContentForColumn(column, row, rowIndex) {
        const click = e => action.ui('makeEditable', e, {row: rowIndex, column});
        const data = {
            on: {
                click
            }
        };

        const className = getClassName(column.name, rowIndex);
        data['class'] = {[className]: true};

        let content = '';
        if (column.name === __rankColumn.name)
            content = rowIndex + 1;
        else
            content = row[column.name];

        return h('div.grid-cell', data, content);
    }
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

function getClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}
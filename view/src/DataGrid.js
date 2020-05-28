//The component view for a DataGrid
const h = require('snabbdom/h').default; // helper function for creating vnodes
const htmlHelpers = require('../../src/htmlHelpers');

const __rankColumn = {
    name: '__rank_column',
    type: 'number',
    isRankColumn: true
}

const draggable = {
    draggable: "true"
}

export function DataGrid(data, action) {
    const columnDefs = data.config.columns;

    const numberOfColumns = columnDefs.length + 1;

    const rowStyle = {
        'grid-template-columns': `repeat(${numberOfColumns}, 1fr)`
    }

    const headerRow = getColumnHeaders(columnDefs);
    const rows = getRowItems(data.rows, columnDefs);

    return h('div.grid', {}, [headerRow].concat(rows));


    function getColumnHeaders(columns) {
        const rankHeader = gridColumnHeader({name: 'Rank', type: 'number'});
        const headerItems = [rankHeader].concat(columns.map(gridColumnHeader));

        return h('div.column-header-row', {style: rowStyle}, headerItems);
    }

    function getRowItems(rows, columns) {
        return rows.map((row, i) => getRow(row, i));

        function getRow(row, i) {
            const rankItem = rowContentForColumn(__rankColumn, row, i);
            const rowItems = columns.map(column => rowContentForColumn(column, row, i));
            return h('div.row', {style: rowStyle, attrs: draggable}, [rankItem].concat(rowItems));
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

function gridColumnHeader(column) {
    return h('div.grid-column-header', column.name);
}

function getClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}
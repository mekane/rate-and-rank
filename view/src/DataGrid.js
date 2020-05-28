//The component view for a DataGrid
const h = require('snabbdom/h').default;
import {Row} from './Row';

export function DataGrid(data, action) {
    const columns = data.config.columns;

    const headerRow = getColumnHeaders(columns);
    const rows = data.rows.map((row, i) => Row(row, i, columns));

    return h('div.grid', {}, [headerRow].concat(rows));


    function getColumnHeaders(columns) {
        const style = {
            'grid-template-columns': `repeat(${columns.length + 1}, 1fr)`
        }

        const rankHeader = gridColumnHeader({name: 'Rank', type: 'number'});
        const headerItems = [rankHeader].concat(columns.map(gridColumnHeader));

        return h('div.column-header-row', {style}, headerItems);
    }

    function gridColumnHeader(column) {
        return h('div.grid-column-header', column.name);
    }
}
//The component view for a DataGrid
import {getGridRowStyles} from "./viewHelpers";
import {Row} from './Row';

const h = require('snabbdom/h').default;

export function Grid(data, action) {
    const columns = data.config.columns;

    const headerRow = getColumnHeaders(columns);
    const rows = data.rows.map((row, i) => Row(row, i, columns));

    return h('div.grid', {}, [headerRow].concat(rows));


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
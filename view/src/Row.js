import {RankCell} from "./RankCell";

const h = require('snabbdom/h').default;
import {GridCell} from './GridCell';
import {getGridRowStyles} from "./viewHelpers";

const draggable = {
    draggable: "true"
}

export function Row(rowValues, rowIndex, columns) {
    const style = getGridRowStyles(columns.length);

    const rankCell = RankCell(rowIndex);
    const rowCells = columns.map(column => GridCell(column, rowValues[column.name], rowIndex));

    return h('div.row', {style, attrs: draggable}, [rankCell].concat(rowCells));
}

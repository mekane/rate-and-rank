import {RankCell} from "./RankCell";

const h = require('snabbdom/h').default;
import {GridCell} from './GridCell';

const draggable = {
    draggable: "true"
}

export function Row(rowValues, rowIndex, columns) {
    console.log(rowValues);

    const style = {
        'grid-template-columns': `repeat(${columns.length + 1}, 1fr)`
    }

    const rankCell = RankCell(rowIndex);
    const rowCells = columns.map(column => GridCell(column, rowValues[column.name], rowIndex));

    return h('div.row', {style, attrs: draggable}, [rankCell].concat(rowCells));
}

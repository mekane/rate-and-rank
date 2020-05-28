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

    const rankItem = RankCell(rowIndex);
    const rowItems = columns.map(column => rowContentForColumn(column, rowValues, rowIndex));

    return h('div.row', {style, attrs: draggable}, [rankItem].concat(rowItems));

    function rowContentForColumn(column) {
        let content = rowValues[column.name];
        return GridCell(column, content, rowIndex);
    }
}

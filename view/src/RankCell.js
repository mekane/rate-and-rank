import {getGridCellClassName} from "./viewHelpers";

const h = require('snabbdom/h').default;

const column = {
    name: '__rank_column',
    type: 'number',
    isRankColumn: true
}

export function RankCell(rowIndex) {
    //make Rank editable!
    const click = e => action.ui('makeEditable', e, {row: rowIndex, column});

    const data = {
        on: {
            click
        }
    };
    const className = getGridCellClassName('__rank-column', rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, rowIndex + 1);
}

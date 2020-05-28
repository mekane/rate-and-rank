const h = require('snabbdom/h').default;
const htmlHelpers = require('../../src/htmlHelpers');

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
    const className = getClassName('__rank-column', rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, rowIndex + 1);
}

//TODO: move duplicate code to a helpers file
function getClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}
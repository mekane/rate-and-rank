const h = require('snabbdom/h').default;
const htmlHelpers = require('../../src/htmlHelpers');

export function GridCell(column, content, rowIndex) {
    const click = e => action.ui('makeEditable', e, {row: rowIndex, column});

    const data = {
        on: {
            click
        }
    };
    const className = getClassName(column.name, rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, content);
}

function getClassName(columnName, rowNumber) {
    const name = htmlHelpers.toCssClassName(columnName);
    return `${name}${rowNumber}`;
}
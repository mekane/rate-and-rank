import {getGridCellClassName} from "./viewHelpers";

const h = require('snabbdom/h').default;

export function GridCell(column, content, rowIndex) {
    const click = e => action.ui('makeEditable', e, {row: rowIndex, column});

    const data = {
        on: {
            click
        }
    };
    const className = getGridCellClassName(column.name, rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, content);
}

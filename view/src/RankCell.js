import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

const h = require('snabbdom/h').default;

const column = {
    name: '__rank_column',
    type: 'number',
    isRankColumn: true
}

export function RankCell(rowIndex, actionDispatch) {
    const data = {
        on: {
            click: makeEditable(column, rowIndex, actionDispatch)
        }
    };
    const className = getGridCellClassName('__rank-column', rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, rowIndex + 1);
}


function makeEditable(column, rowIndex, actionDispatch) {
    return function (event) {
        editRank(event.target, rowIndex, actionDispatch);
    }
}


function editRank(gridCell, rowIndex, actionDispatch) {
    const originalValue = gridCell.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = 1;
    input.value = originalValue;

    const action = 'moveRow';
    const actionData = {
        action,
        rowIndex
    }

    function submit() {
        actionData.newIndex = input.value - 1;
        input.blur();
        actionDispatch(actionData);
    }

    function cancel() {
        input.remove();
        gridCell.innerHTML = originalValue;
    }

    //render()
    gridCell.innerHTML = '';
    gridCell.append(input);
    input.select();

    input.addEventListener('blur', cancel);
    input.addEventListener('keydown', preventTab);
    input.addEventListener('keyup', e => {
        switch (e.key) {
            case "Enter":
                submit();
                break;
            case "Esc":
            case "Escape":
                input.blur();
                break;
            case "Tab":
                submit();
                tabToNextCell(gridCell, e.shiftKey);
                break;
            default:
                return;
        }
    });
}
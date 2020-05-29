import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

const h = require('snabbdom/h').default;

const column = {
    name: '__rank_column',
    type: 'number',
    isRankColumn: true
}

export function RankCell(rowIndex) {
    const data = {
        on: {
            click: makeEditable(column, rowIndex)
        }
    };
    const className = getGridCellClassName('__rank-column', rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, rowIndex + 1);
}


function makeEditable(column, rowIndex) {
    return function (event) {
        editRank(event.target, rowIndex);
    }
}


function editRank(gridCell, rowIndex) {
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
        window.action(actionData);
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
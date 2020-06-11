import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

const h = require('snabbdom/h').default;

export function RankCell(rowIndex, actionDispatch) {
    const data = {
        on: {
            click: [makeEditable, rowIndex, actionDispatch]
        }
    };
    const className = getGridCellClassName('__rank-column', rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, rowIndex + 1);
}

function makeEditable(rowIndex, actionDispatch, event) {
    const gridCell = event.target;
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
        if (input.value === originalValue) {
            console.log('edit rank: no change - cancel');
            return;
        }
        actionData.newIndex = input.value - 1;
        input.blur();
        actionDispatch(actionData);
    }

    function cancel() {
        input.remove();
        gridCell.innerHTML = originalValue;
    }

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
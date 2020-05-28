import {getGridCellClassName} from "./viewHelpers";

const h = require('snabbdom/h').default;

export function GridCell(column, content, rowIndex) {
    const data = {
        on: {
            click: makeEditable(column, rowIndex)
        }
    };
    const className = getGridCellClassName(column.name, rowIndex);
    data['class'] = {[className]: true};

    return h('div.grid-cell', data, content);
}

function makeEditable(column, rowIndex) {
    if (column.type === 'number') {
        return function (event) {
            editNumber(event.target, column, rowIndex);
        }
    }
    else {
        return function (event) {
            editText(event.target, column, rowIndex);
        }
    }
}


function editText(element, columnDef, rowIndex) {
    const originalValue = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalValue;

    const action = 'setField';
    const actionData = {
        action,
        rowIndex,
        columnName: columnDef.name
    }

    function submit() {
        actionData.value = input.value;
        //input.blur();
        window.action(actionData);
    }

    function cancel() {
        input.remove();
        element.innerHTML = originalValue;
    }

    //render()
    element.innerHTML = '';
    element.append(input);
    input.select();

    input.addEventListener('blur', cancel);
    input.addEventListener('keyup', e => {
        switch (e.key) {
            case "Enter":
                submit();
                break;
            case "Esc":
            case "Escape":
                input.blur();
                break;
            default:
                return;
        }
    });
}

function editNumber(element, actionData) {
    console.log('Edit number', element, actionData);
}


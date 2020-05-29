import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

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

function makeEditable(columnDef, rowIndex) {
    let inputType = 'text';
    if (columnDef.type === 'number')
        inputType = 'number';

    return function (event) {
        const element = event.target;
        const originalValue = element.textContent;
        const input = document.createElement('input');
        input.type = inputType;
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
                    tabToNextCell(e);
                    break;
                default:
                    return;
            }
        });
    }
}

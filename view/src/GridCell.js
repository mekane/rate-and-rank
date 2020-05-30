import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

const h = require('snabbdom/h').default;

export function GridCell(column, rawContent, rowIndex) {
    const data = {
        on: {
            click: makeEditable(column, rowIndex)
        }
    };
    const className = getGridCellClassName(column.name, rowIndex);
    data['class'] = {[className]: true};

    const content = cellContent(column.type, rawContent);

    return h('div.grid-cell', data, content);
}

function cellContent(columnType, rawContent) {
    if (columnType === 'image') {
        return makeImageCellContent(rawContent);
    }
    else
        return rawContent;
}

function makeImageCellContent(imgSrc) {
    const children = [];

    if (isValid(imgSrc)) {
        const imgData = {
            attrs: {
                src: imgSrc,
            }
        };
        const img = h('img', imgData);
        children.push(img);
    }
    else {
        const dropTargetData = {};
        const dropTarget = h('div.image-drop-target', dropTargetData, 'Click or Drop Image Here');
        children.push(dropTarget);
    }

    const uploaderData = {
        attrs: {
            type: 'file',
            accept: 'image/*'
        },
        style: {
            display: 'none'
        }
    };
    const uploader = h('input', uploaderData);
    children.push(uploader);

    return children;
}

//TODO: could improve this. Add check for "data:image/..." or "http://" at beginning
function isValid(string) {
    return string && string.length;
}

function makeEditable(columnDef, rowIndex) {
    if (columnDef.type === 'image')
        return; //TODO: implement

    let inputType = 'text';
    if (columnDef.type === 'number')
        inputType = 'number';

    return function (event) {
        const gridCell = event.target;
        const originalValue = gridCell.textContent;
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
}

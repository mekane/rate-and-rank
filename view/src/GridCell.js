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

    const content = cellContent(column.type);

    return h('div.grid-cell', data, content);


    function cellContent(columnType) {
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
                //TODO: try using snabbdom hooks to check for load error and modify the element
            };
            const img = h('img', imgData);
            children.push(img);
        }
        else {
            const dropTargetData = {
                on: {
                    click: showFileChooser,
                    dragenter: allowImageDrops,
                    dragover: allowImageDrops,
                    dragleave: unHighlight,
                    drop: [handleImageDrop, rowIndex, column.name]
                }
            };
            const dropTarget = h('div.image-drop-target', dropTargetData, 'Drop Image or Click Here');
            children.push(dropTarget);
        }

        const uploaderData = {
            attrs: {
                type: 'file',
                accept: 'image/*'
            },
            style: {
                display: 'none'
            },
            on: {
                change: [fileChosen, rowIndex, column.name]
            }
        };
        const uploader = h('input', uploaderData);
        children.push(uploader);

        return children;
    }
}

//TODO: could improve this. Add check for "data:image/..." or "http://" at beginning
function isValid(string) {
    return string && string.length;
}

function showFileChooser(e) {
    const parent = e.target.parentElement;
    const fileChooser = parent.querySelector('input[type="file"]');
    fileChooser.click();
}

function allowImageDrops(event) {
    if (couldDropHere(event.dataTransfer)) {
        event.preventDefault();
        event.currentTarget.classList.add('drophighlight');
    }
}

function couldDropHere(dt) {
    return dt.types.includes('Files');
}

function unHighlight(e) {
    e.currentTarget.classList.remove('drophighlight');
}

function handleImageDrop(rowIndex, columnName, e) {
    e.preventDefault();
    unHighlight(e);
    processDataTransfer(e.dataTransfer)
        .then(imageData => saveImageData(rowIndex, columnName, imageData));
}

function processDataTransfer(dataTransfer) {
    const types = [...dataTransfer.types];

    const hasFile = types.includes('Files');
    const hasLink = types.includes('text/uri-list');
    const hasText = types.includes('text/plain');

    if (hasFile) {
        const files = [...dataTransfer.files];
        return saveImageDataFromFile(files[0]);
    }
    else if (hasLink) {
        const link = dataTransfer.getData('text/uri-list');
        return saveImageDataFromLink(link);
    }
    else if (hasText) {
        const text = dataTransfer.getData('text/plain');
        return saveImageDataFromLink(text);
    }
    else {
        console.log('No data found in dropped item');
    }
}

function fileChosen(rowIndex, columnName, e) {
    const file = e.target.files[0];
    return saveImageDataFromFile(file)
        .then(imageData => saveImageData(rowIndex, columnName, imageData));
}

function saveImageDataFromFile(file) {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsDataURL(file);
        reader.addEventListener('load', e => resolve(reader.result));
    });
}

function saveImageDataFromLink(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        };
        image.src = url;
    });
}

function saveImageData(rowIndex, columnName, value) {
    window.action({action: 'setField', rowIndex, columnName, value});
}

function makeEditable(columnDef, rowIndex) {
    if (columnDef.type === 'image') {
        console.log('cell clicked');
        return; //TODO: implement
    }

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

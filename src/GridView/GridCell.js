import {getGridCellClassName, preventTab, tabToNextCell} from "./viewHelpers";

const htmlHelpers = require('../htmlHelpers');

const markdownOptions = {
    html: false, //don't allow arbitrary html in markdown blocks
    breaks: true, //convery newlines to <br>
    linkify: true //automatically turn URL text into links
};
const markDown = require('markdown-it')(markdownOptions);
const h = require('snabbdom/h').default;

export function GridCell(column, rawContent, rowIndex, actionDispatch) {
    const data = {
        on: {
            click: [makeEditable, column, rowIndex, rawContent, actionDispatch]
        }
    };
    const className = getGridCellClassName(column.name, rowIndex);
    data['class'] = {[className]: true};

    if (column.type === 'option') {
        const optionClassName = htmlHelpers.cssSafeString(rawContent);
        if (optionClassName)
            data['class'][optionClassName] = true;
    }

    const content = cellContent(column.type);

    return h('div.grid-cell', data, content);


    function cellContent(columnType) {
        if (columnType === 'image') {
            return makeImageCellContent(rawContent);
        }
        else if (columnType === 'markdown') {
            const markdown = markDown.renderInline(rawContent);
            return h('p', {props: {innerHTML: markdown}});
        }
        else if (columnType === 'option') {
            return column.options[rawContent];
        }
        else
            return rawContent;
    }

    function makeImageCellContent(imgSrc) {
        const children = [];

        if (isValidImgSrcValue(imgSrc)) {
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
                    drop: [handleImageDrop, rowIndex, column.name, actionDispatch]
                    //paste: [handleImagePaste, rowIndex, column.name]
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
                change: [fileChosen, rowIndex, column.name, actionDispatch]
            }
        };
        const uploader = h('input', uploaderData);
        children.push(uploader);

        return children;
    }
}

//TODO: could improve this. Add check for "data:image/..." or "http://" at beginning
function isValidImgSrcValue(string) {
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

function handleImageDrop(rowIndex, columnName, actionDispatch, e) {
    console.log('image dropped on row ' + rowIndex + ' ' + columnName, actionDispatch);
    e.preventDefault();
    unHighlight(e);
    processDataTransfer(e.dataTransfer)
        .then(imageData => saveImageData(rowIndex, columnName, actionDispatch, imageData));
}

function handleImagePaste(rowIndex, columnName, actionDispatch, e) {
    console.log('paste');
    processDataTransfer(e.clipboardData)
        .then(imageData => saveImageData(rowIndex, columnName, actionDispatch, imageData));
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

function fileChosen(rowIndex, columnName, actionDispatch, e) {
    const file = e.target.files[0];
    return saveImageDataFromFile(file)
        .then(imageData => saveImageData(rowIndex, columnName, actionDispatch, imageData));
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

        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        };
        image.src = url;
    });
}

function saveImageData(rowIndex, columnName, actionDispatch, value) {
    actionDispatch({action: 'setField', rowIndex, columnName, value});
}

function makeEditable(columnDef, rowIndex, originalValue, actionDispatch, event) {
    if (columnDef.type === 'image') {
        console.log('TODO: edit image cell');
        return; //TODO: implement
    }

    const gridCell = event.target;

    if (gridCell.querySelector('.cell-edit-overlay')) {
        console.log('already editing, abort');
        return;
    }

    const action = 'setField';
    const actionData = {
        action,
        rowIndex,
        columnName: columnDef.name
    }

    function submit() {
        console.log(`submit ${input.value} / ${originalValue}`);
        if (input.value === originalValue) {
            console.log('submit - no value change, cancel');
            cancel();
            return;
        }

        actionData.value = input.value;
        console.log('submit', actionData);
        actionDispatch(actionData);
    }

    function cancel() {
        console.log('cancel');
        input.removeEventListener('blur', submit);
        editor.remove();
    }

    function tab(shift) {
        console.log('tab ' + (shift ? 'backward' : 'forward'));
        tabToNextCell(gridCell, shift);
    }

    const input = getCellContentEditor(columnDef, originalValue, submit, cancel, tab);
    const editor = makeEditorOverlay(input);

    gridCell.append(editor);
    input.focus();
    if (typeof input.select === 'function')
        input.select();
}

function getCellContentEditor(columnDef, originalValue, submitFn, cancelFn, tabFn) {
    const type = columnDef.type;
    const isSingleLine = (type === 'string' || type === 'number');
    const isTextEditor = (isSingleLine || type === 'markdown');

    console.log('make editor for ' + type, originalValue);

    let input;

    //TODO: some kind of polymorphic dispatch rather than if/elses
    if (type === 'image') {

    }
    else if (type === 'markdown') {
        input = document.createElement('textarea');
        input.textContent = originalValue;
    }
    else if (type === 'option') {
        input = document.createElement('select');

        const emptyOption = document.createElement('option');
        input.appendChild(emptyOption);

        const values = Object.keys(columnDef.options);
        values.forEach(value => {
            const labelText = columnDef.options[value];
            const option = document.createElement('option');
            option.textContent = labelText;
            option.value = value;
            if (value === originalValue)
                option.selected = true;
            input.appendChild(option);
        });
    }
    else {
        input = document.createElement('input');
        input.type = (type === 'number' ? 'number' : 'text');
        input.value = originalValue;
    }

    // This submits the input pretty much by default. We prevent it in cancel()
    input.addEventListener('blur', submitFn);
    input.addEventListener('keydown', preventTab);
    input.addEventListener('keyup', e => {
        e.stopPropagation();
        switch (e.key) {
            case "Esc":
            case "Escape":
                console.log('input key escape - cancel');
                cancelFn();
                break;
            case "Tab":
                console.log('input key tab - submit and tab');
                input.blur();
                tabFn(e.shiftKey);
                break;
            default:
                return;
        }
    });

    if (isSingleLine)
        input.addEventListener('keyup', submitOnEnter(submitFn));

    return input;
}

function submitOnEnter(submitFn) {
    return function(e) {
        if (e.key === 'Enter') {
            console.log('submit on enter ' + e.key);
            e.target.blur();
        }
    }
}

function makeEditorOverlay(inputEl) {
    const editor = document.createElement('div');
    editor.className = 'cell-edit-overlay';
    editor.appendChild(inputEl);
    editor.addEventListener('click', e => e.stopPropagation());
    return editor;
}
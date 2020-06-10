import waitForDocumentReady from "./documentReady";

window.dataGridUndos = [];
window.dataGridRedos = [];

export default function initializeGlobalGridControls() {
    waitForDocumentReady(document)
        .then(initGlobalUndoHandler);
}


function initGlobalUndoHandler() {
    const body = document.querySelector('body');
    body.addEventListener('keyup', handleKeys);

    const gridControls = document.createElement('footer');
    gridControls.className = 'grid-controls';
    gridControls.addEventListener('mouseenter', updateUndoRedoButtonStates);

    const undoButton = document.createElement('button');
    undoButton.className = 'grid-controls__undo-button';
    undoButton.textContent = 'Undo';
    undoButton.addEventListener('click', globalUndo);

    const redoButton = document.createElement('button');
    redoButton.className = 'grid-controls__redo-button';
    redoButton.textContent = 'Redo';
    redoButton.addEventListener('click', globalRedo);

    gridControls.appendChild(undoButton);
    gridControls.appendChild(redoButton);
    body.appendChild(gridControls);

    updateUndoRedoButtonStates();
}

function handleKeys(e) {
    let key = e.key;

    if (e.ctrlKey)
        key = `ctrl+${key}`;

    switch (key) {
        case "ctrl+z":
            globalUndo();
            break;
        case "ctrl+Z":
            globalRedo();
            break;
    }
}

function globalUndo() {
    const lastUndoRedoCommand = window.dataGridUndos.pop();
    console.log('Global Undo', window.dataGridUndos);
    if (lastUndoRedoCommand) {
        lastUndoRedoCommand.undo();
        window.dataGridRedos.unshift(lastUndoRedoCommand);
    }
    updateUndoRedoButtonStates();
}

function globalRedo() {
    const firstRedoCommand = window.dataGridRedos.shift();
    console.log('Global Redo', window.dataGridRedos);
    if (firstRedoCommand) {
        firstRedoCommand.redo();
        window.dataGridUndos.push(firstRedoCommand);
    }
    updateUndoRedoButtonStates();
}

function updateUndoRedoButtonStates() {
    const undoButton = document.querySelector('.grid-controls__undo-button');
    const redoButton = document.querySelector('.grid-controls__redo-button');

    if (undoButton == null || redoButton == null)
        return;

    if (thereAreUndos())
        undoButton.classList.remove('grid-controls__undo-button--disabled');
    else
        undoButton.classList.add('grid-controls__undo-button--disabled');

    if (thereAreRedos())
        redoButton.classList.remove('grid-controls__redo-button--disabled');
    else
        redoButton.classList.add('grid-controls__redo-button--disabled');
}

function thereAreUndos() {
    return window.dataGridUndos && window.dataGridUndos.length;
}

function thereAreRedos() {
    return window.dataGridRedos && window.dataGridRedos.length;
}

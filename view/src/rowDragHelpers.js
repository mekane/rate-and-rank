
export function addActiveDragClassToParentGrid(el) {
    const gridContainer = el.closest('.grid');
    gridContainer.classList.add('drag-active');
}

export function removeActiveDragClassFromParentGrid(el) {
    const gridContainer = el.closest('.grid');
    gridContainer.classList.remove('drag-active');
}
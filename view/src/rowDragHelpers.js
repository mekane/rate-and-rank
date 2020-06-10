
export function addActiveDragClassToParentGrid(el) {
    const gridContainer = el.closest('.grid');
    gridContainer.classList.add('drag-active');
}
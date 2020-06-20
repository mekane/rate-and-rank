import {GridCell} from './GridCell';
import {RankCell} from "./RankCell";
import {getGridRowStyles} from "./viewHelpers";
import {
    addActiveDragClassToParentGrid,
    allowRowDrops, dragEnded, dragLeave, getDraggingRowFromData,
    initDataTransfer
} from "./rowDragHelpers";

const h = require('snabbdom/h').default;

export function Row(rowValues, rowIndex, columns, actionDispatch) {
    const rankCell = RankCell(rowIndex, actionDispatch);
    const rowCells = columns.map(column => GridCell(column, rowValues[column.name], rowIndex, actionDispatch));

    const data = {
        attrs: {
            draggable: "true"
        },
        on: {
            dragstart: initializeDragRow,
            dragenter: allowRowDrops,
            dragover: allowRowDrops,
            dragleave: dragLeave,
            dragend: dragEnded,
            drop: rowDropped
        },
        style: getGridRowStyles(columns.length)
    };

    return h('div.row', data, [rankCell].concat(rowCells));


    function initializeDragRow(event) {
        const dt = event.dataTransfer;
        const el = event.currentTarget;
        const rowData = JSON.stringify({action: 'moveRow', rowIndex});

        addActiveDragClassToParentGrid(el);
        el.classList.add('dragging');

        initDataTransfer(dt, rowData);
    }

    function rowDropped(event) {
        event.preventDefault();

        event.currentTarget.classList.remove('drophighlight');
        const moveRow = getDraggingRowFromData(event);

        if (moveRow.action === 'moveRow') {
            moveRow.newIndex = rowIndex;

            actionDispatch(moveRow);
        }
    }
}

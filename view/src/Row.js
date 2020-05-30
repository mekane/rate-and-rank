import {RankCell} from "./RankCell";

const h = require('snabbdom/h').default;
import {GridCell} from './GridCell';
import {getGridRowStyles} from "./viewHelpers";

const rowDataType = 'text/actionjson';

export function Row(rowValues, rowIndex, columns) {
    const rankCell = RankCell(rowIndex);
    const rowCells = columns.map(column => GridCell(column, rowValues[column.name], rowIndex));

    const data = {
        attrs: {
            draggable: "true"
        },
        on: {
            dragstart: initializeDragRow,
            dragenter: dragEnter,
            dragover: allowRowDrops,
            dragleave: dragLeave,
            drop: rowDropped
        },
        style: getGridRowStyles(columns.length)
    };

    return h('div.row', data, [rankCell].concat(rowCells));


    function initializeDragRow(event) {
        const dt = event.dataTransfer;
        const rowData = JSON.stringify({action: 'moveRow', rowIndex});

        event.currentTarget.classList.add('dragging');

        dt.setData(rowDataType, rowData);
        dt.effectAllowed = 'move';
    }

    function dragEnter(event) {
        if (couldDropHere(event.dataTransfer)) {
            event.preventDefault();
            event.currentTarget.classList.add('drophighlight');
        }
    }

    function allowRowDrops(event) {
        if (couldDropHere(event.dataTransfer))
            event.preventDefault();
    }

    function couldDropHere(dt) {
        return (dt.effectAllowed === 'move' && dt.types.includes(rowDataType));
    }

    function dragLeave(event) {
        event.currentTarget.classList.remove('drophighlight');
    }

    function rowDropped(event) {
        event.preventDefault();

        event.currentTarget.classList.remove('drophighlight');
        const moveRow = getDraggingRowFromData(event);

        if (moveRow.action === 'moveRow') {
            moveRow.newIndex = rowIndex;

            window.action(moveRow);
        }
    }

    function getDraggingRowFromData(event) {
        const dataString = event.dataTransfer.getData(rowDataType);

        let moveRow = {};

        try {
            moveRow = JSON.parse(dataString);
        } catch (err) {
            console.log('Error processing row drop ' + err);
        }

        return moveRow;
    }
}

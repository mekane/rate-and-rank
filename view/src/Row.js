import {GridCell} from './GridCell';
import {RankCell} from "./RankCell";
import {getGridRowStyles} from "./viewHelpers";
import {addActiveDragClassToParentGrid, removeActiveDragClassFromParentGrid} from "./rowDragHelpers";
const h = require('snabbdom/h').default;

//TODO: refactor out duplicated code
const rowDataType = 'text/actionjson';

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

        dt.setData(rowDataType, rowData);
        dt.effectAllowed = 'move';
    }

    //TODO: refactor common code to helpers
    function allowRowDrops(event) {
        if (couldDropRowHere(event.dataTransfer)) {
            event.preventDefault();
            event.currentTarget.classList.add('drophighlight');
        }
    }

    //TODO: refactor common code to helpers
    function couldDropRowHere(dt) {
        return (dt.effectAllowed === 'move' && dt.types.includes(rowDataType));
    }

    function dragLeave(event) {
        //TODO: research currentTarget vs. target
        const el = event.currentTarget;
        el.classList.remove('drophighlight');
    }

    function dragEnded(event) {
        console.log('row drag ended');
        const el = event.currentTarget;
        removeActiveDragClassFromParentGrid(el);
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

    function getDraggingRowFromData(event) {
        const dataString = event.dataTransfer.getData(rowDataType);

        if (dataString === '')
            return {}; //ignore non-row drops

        let moveRow = {};

        try {
            moveRow = JSON.parse(dataString);
        } catch (err) {
            console.log('Error processing row drop ' + err);
        }

        return moveRow;
    }
}

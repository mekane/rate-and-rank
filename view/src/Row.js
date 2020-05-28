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
            dragenter: allowRowDrops,
            dragover: allowRowDrops,
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
        console.log('start dragging row ' + rowIndex, rowData);
    }

    function allowRowDrops(event) {
        const dt = event.dataTransfer;

        if (dt.effectAllowed === 'move' && dt.types.includes(rowDataType)) {
            event.preventDefault();
        }
    }

    //TODO: use dragenter and dragleave to highlight / show space for rows

    function rowDropped(event) {
        const dataString = event.dataTransfer.getData(rowDataType);
        event.preventDefault();

        let moveRow = {};
        try {
            moveRow = JSON.parse(dataString);
        } catch (err) {
            console.log('Error processing row drop ' + err);
        }

        if (moveRow.action === 'moveRow') {
            moveRow.newIndex = rowIndex;
            window.action(moveRow);
        }
    }
}

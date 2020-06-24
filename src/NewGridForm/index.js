const snabbdom = require('snabbdom');
const toVNode = require('snabbdom/tovnode').default;
const patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/attributes').default,
    require('snabbdom/modules/class').default,
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/style').default,
    require('snabbdom/modules/eventlisteners').default
]);
const h = require('snabbdom/h').default;

const columnTypes = [
    'string',
    'markdown',
    'number',
    'image',
    'choice'
];

const config = {
    name: 'New Grid',
    columns: [
        {name: 'Column 1'}
    ]
};

const formClassName = 'interactive-grid-form';

const rootNode = document.createElement('div');
rootNode.className = formClassName;

let rootVnode = toVNode(rootNode);

let oldForm;
let oldConfigInput;

/**
 * This module progressively enhances the New Grid form in the rate and rank server
 * to provide an interactive builder for a new grid config. It converts the values
 * from the interactive part back into a JSON structure which is placed into the
 * existing config input.
 */
export function init(formSelector) {
    oldForm = document.querySelector(formSelector);
    //oldForm.style.display = 'none';
    oldConfigInput = oldForm.querySelector('textarea[name="config"]');

    document.querySelector('body').appendChild(rootNode);

    renderGridForm();
}

function renderGridForm() {
    console.log(config);
    oldConfigInput.value = JSON.stringify(config);

    const newVnode = formTopLevel();

    patch(rootVnode, newVnode);
    rootVnode = newVnode;
}

function formTopLevel() {
    return h(`div.${formClassName}`, [
        h('header', 'New Grid Definition'),
        makeGridNameInput(),
        makeAddFirstColumnButton(),
        ...makeColumnEditors(),
        makeSubmitButton(),
    ]);
}

function makeGridNameInput() {
    const input = h('input', {
        attrs: {
            type: 'text'
        },
        on: {
            change: e => setName(e.target.value)
        }
    });
    return h('label', ['Grid Name', input]);
}

function setName(newName) {
    config.name = newName;
    renderGridForm();
}

function makeAddFirstColumnButton() {
    return h('button.add', {
            attrs: {
                type: 'button'
            },
            on: {
                click: [addColumn, -1]
            }
        },
        'Add Column'
    );
}

function makeColumnEditors() {
    return config.columns.map(column);
}

function column(columnConfig, i) {
    const columnType = columnConfig.type || 'string';
    const columnDefault = columnConfig.default || '';

    const name = makeNameInput(i);
    const type = makeTypeInput(columnType, i);
    const properties = makePropertiesSettings(columnType, columnDefault, i);
    const add = makeAddButton(i);
    const remove = makeRemoveButton(i);

    //TODO:
    // * If number: min, max and step (also TODO: make these work)
    // * If choice: add choice editor
    // *

    return h('div.column', [name, type, add, remove, properties]);
}

function makeTypeInput(columnType, i) {
    const options = columnTypes.map(type => {
        const attrs = {
            value: type
        };

        if (type === columnType)
            attrs.selected = true;

        return h('option', {attrs}, type);
    });

    const typeInput = h('select.column-type', {
            on: {
                change: [setColumnType, i]
            }
        },
        options
    );

    return h('label', ['Column Type', typeInput]);
}

function makeNameInput(i) {
    const nameInput = h('input.column-name', {
            attrs: {
                type: 'text',
                value: config.columns[i].name
            },
            on: {
                change: [setColumnName, i]
            }
        }
    );
    return h('label', ['Column Name', nameInput]);
}

function makePropertiesSettings(columnType, columnDefault, i) {
    const defaultValue =makeDefaultValueInput(columnDefault, i);

    return h('div.properties', defaultValue);
}

function makeDefaultValueInput(columnDefault, i) {
    const defaultValueInput = h('input', {
        attrs: {
            type: 'text',
            value: columnDefault
        },
        on: {
            change: [setColumnDefault, i]
        }
    });

    return h('label', ['Default Value', defaultValueInput]);
}

function makeAddButton(i) {
    return h('button.add', {
            attrs: {
                title: 'Add Column After This One',
                type: 'button'
            },
            on: {
                click: [addColumn, i]
            }
        },
        '+'
    );
}

function makeRemoveButton(i) {
    return h('button.remove', {
            attrs: {
                title: 'Remove This Column',
                type: 'button'
            },
            on: {
                click: [removeColumn, i]
            }
        },
        '-'
    );
}

function setColumnName(num, e) {
    console.log('setColumnName ' + num, e);
    config.columns[num].name = e.target.value;
    renderGridForm();
}

function setColumnType(num, e) {
    console.log('setColumnType ' + num, e.target.value);
    config.columns[num].type = e.target.value;
    renderGridForm();
}

function setColumnDefault(num, e) {
    console.log('setColumnDefault ' + num, e);
    config.columns[num].default = e.target.value;
    renderGridForm();
}

function addColumn(num, e) {
    const position = num + 1;
    config.columns.splice(position, 0, {name: `Column ${position}`});
    renderGridForm();
}

function removeColumn(num, e) {
    config.columns.splice(num, 1);
    renderGridForm();
}

function makeSubmitButton() {
    return h('button.submit', {
            on: {
                click: e => oldForm.submit()
            }
        },
        'Create New Grid'
    );
}

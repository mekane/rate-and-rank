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
    oldConfigInput = oldForm.querySelector('textarea[name="config"]');

    console.log('hide form');
    //form.style.display = 'none';

    console.log('initialize interactive inputs');
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
    return h('div.' + formClassName, [
        h('header', 'New Grid Definition'),
        nameInput(),
        ...columns()
    ]);
}

function nameInput() {
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

function columns() {
    return config.columns.map(column);
}

function column(columnConfig, i) {
    const columnType = columnConfig.type || 'string';

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
    const name = h('label', ['Column Name', nameInput]);

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
    const type = h('label', ['Column Type', typeInput]);

    const contents = [name, type];

    return h('div.column', contents);
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
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
    'option'
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

    const name = makeNameInput(i);
    const type = makeTypeInput(columnType, i);
    const add = makeAddColumnButton(i);
    const remove = makeRemoveColumnButton(i);
    const properties = makePropertiesSettings(columnConfig, i);

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

function makePropertiesSettings(columnConfig, i) {
    const children = [];
    const columnType = columnConfig.type || 'string';

    if (columnType === 'number') {
        children.push(makeMinimumInput(columnConfig.min, i));
        children.push(makeMaximumInput(columnConfig.max, i));
        children.push(makeStepSizeInput(columnConfig.step, i));
    }

    if (columnType === 'option') {
        children.push(makeOptionsEditor(columnConfig, i));
    }

    children.push(makeDefaultValueInput(columnConfig, i));

    return h('div.properties', children);
}

function makeMinimumInput(current, i) {
    const minInput = h('input', {
        attrs: {
            type: 'number',
            value: current
        },
        on: {
            change: [setColumnMin, i]
        }
    });
    return h('label', ['Column Min', minInput]);
}

function makeMaximumInput(current, i) {
    const maxInput = h('input', {
        attrs: {
            type: 'number',
            value: current
        },
        on: {
            change: [setColumnMax, i]
        }
    });
    return h('label', ['Column Max', maxInput]);
}

function makeStepSizeInput(current, i) {
    const stepSize = h('input', {
        attrs: {
            type: 'number',
            value: current
        },
        on: {
            change: [setColumnStepSize, i]
        }
    });
    return h('label', ['Step Size', stepSize]);
}

function makeOptionsEditor(columnConfig, columnNum) {
    const columnOptions = Object.keys(columnConfig.options || []);
    console.log('make options', columnOptions);
    const options = columnOptions.map(makeOptionRow);

    if (options.length === 0) {
        options.push(h('button.add', {
                attrs: {
                    title: 'Add option after this one',
                    type: 'button'
                },
                on: {
                    click: [addOption, columnNum, 'test']
                }
            },
            '+'
        ));
    }

    return h('div', options);

    function makeOptionRow(optionValue, keyNum) {
        const add = h('button.add', {
                attrs: {
                    title: 'Add option after this one',
                    type: 'button'
                },
                on: {
                    click: [addOption, columnNum, optionValue]
                }
            },
            '+'
        );
        const remove = h('button.remove', {
                attrs: {
                    title: 'Remove this option',
                    type: 'button'
                },
                on: {
                    click: [removeOption, columnNum, optionValue]
                }
            },
            '-'
        );
        const optionInput = h('input', {
            attrs: {
                type: 'text',
                value: optionValue
            },
            on: {
                change: [setOptionValue, columnNum, optionValue]
            }
        });

        const option = h('label', [optionInput]);

        return h('div.option-row', [option, add, remove]);
    }
}

function addOption(colNum, optVal, e) {
    console.log('add option', colNum, optVal);
    const options = config.columns[colNum].options;
    if (typeof options !== 'object') {
        config.columns[colNum].options = {};
    }
    config.columns[colNum].options[optVal] = optVal;
    renderGridForm();
}

function removeOption(colNum, optVal) {
    console.log('remove option', colNum, optVal);
}

function setOptionValue(colNum, optVal, e) {
    const options = config.columns[colNum].options;
    console.log(`replace ${optVal} with ${e.target.value}`);
    //TODO: edit option value
}

function makeDefaultValueInput(columnConfig, i) {
    const columnDefault = columnConfig.default || '';
    const columnType = columnConfig.type || 'string';

    const defaultValueInput = h('input', {
        attrs: {
            type: columnType === 'number' ? 'number' : 'text',
            value: columnDefault
        },
        on: {
            change: [setColumnDefault, i]
        }
    });

    return h('label', ['Default Value', defaultValueInput]);
}

function makeAddColumnButton(i) {
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

function makeRemoveColumnButton(i) {
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

function setColumnMin(num, e) {
    config.columns[num].min = e.target.value;
    renderGridForm();
}

function setColumnMax(num, e) {
    config.columns[num].max = e.target.value;
    renderGridForm();
}

function setColumnStepSize(num, e) {
    config.columns[num].step = e.target.value;
    renderGridForm();
}

function setColumnDefault(num, e) {
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

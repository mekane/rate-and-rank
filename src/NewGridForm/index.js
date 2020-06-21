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

/**
 * This module progressively enhances the New Grid form in the rate and rank server
 * to provide an interactive builder for a new grid config. It converts the values
 * from the interactive part back into a JSON structure which is placed into the
 * existing config input.
 */
export function init(formSelector) {
    const form = document.querySelector(formSelector);

    const configInput = form.querySelector('textarea[name="config"]');
    console.log('config', configInput);

    console.log('hide form');
    form.style.display = 'none';

    console.log('initialize interactive inputs');
    document.querySelector('body').appendChild(rootNode);

    renderGridForm();
}

function renderGridForm() {
    console.log(config);

    const newVnode = h('div.' + formClassName, [
        h('div', 'Interactive New Grid Form'),
        h('p', config.count || 0),
        h('button', {on: {click: e => {config.count = 1 + (config.count||0); renderGridForm()}}}, 'Click Me')
    ]);
    patch(rootVnode, newVnode);
    rootVnode = newVnode;
}
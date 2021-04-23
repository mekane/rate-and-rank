const styles = `
  .body {
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 6px;
    position: relative;
  }

  img {
    border: 1px solid transparent;
    cursor: pointer;
  }
  
  .body.selected img{
    border: 1px solid black;
    cursor: auto;
  }
  
  .body.dragging img {
    border-color: #0f0;
  }
  
  .remove {
    background: rgba(0,0,0,0.4);
    border: 1px solid red;
    color: red;
    cursor: pointer;
    display: none;
    font-family: arial;
    height: 20px;
    position: absolute;
    right: 4px;
    top: 4px;
    text-align: center;
    width: 20px;
  }

  .drag {
    cursor: grab;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid black;
    border-radius: 2px;
    display: none;
    height: 8px;
    position: absolute;
    width: 8px;
  }

  .drag:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .drag.corner {
    bottom: -4px;
    right: -4px;
  }
  
  .drag.right {
    top: calc(50% - 24px);
    right: -2px;
    width: 4px;
    height: 36px;
  }
  
  .drag.bottom {
    left: calc(50% - 24px);
    bottom: -2px;
    height: 4px;
    width: 36px;
  }
  
  .body.selected .drag,
  .body.selected .remove {
    display: block;
  }
  
`;

function create(tagName, initialText, cssClass = '') {
    const el = document.createElement(tagName);
    el.textContent = initialText;
    if (cssClass.length) {
        const parts = cssClass.split(' ');
        parts.forEach(c => el.classList.add(c))
    }
    //console.log(`create(${tagName}, '${initialText}', '${cssClass}')`)
    return el;
}

class ImageEditor extends HTMLElement {

    dragMode = false;
    selectedMode = false;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});

        const style = create('style');
        style.textContent = styles;
        shadowRoot.appendChild(style);

        const body = create('div', '', 'body');
        this.bodyDiv = body;

        const removeTag = create('div', 'x', 'remove');
        removeTag.addEventListener('click', e => this.removeClicked(e))
        body.appendChild(removeTag);

        const imageTag = create('img');
        body.addEventListener('click', e => this.imageClicked(e));
        body.appendChild(imageTag);
        this.imageTag = imageTag;

        const dragHandleRight = create('div', '', 'drag right');
        dragHandleRight.addEventListener('mousedown', e => this.dragStart(e, 'right'))
        body.appendChild(dragHandleRight);

        const dragHandleCorner = create('div', '', 'drag corner');
        dragHandleCorner.addEventListener('mousedown', e => this.dragStart(e, 'corner'))
        body.appendChild(dragHandleCorner);

        const dragHandleBottom = create('div', '', 'drag bottom');
        dragHandleBottom.addEventListener('mousedown', e => this.dragStart(e, 'bottom'))
        body.appendChild(dragHandleBottom);

        shadowRoot.appendChild(body);

        document.addEventListener('click', e => this.cancelSelection())
        document.addEventListener('keyup', e => e.key === 'Escape' ? this.cancelSelection() : null)
        document.addEventListener('mouseup', e => {
            console.log('mouseup', e.target);
            this.cancelSelection();
        })
    }

    cancelSelection() {
        this.selectedMode = false;
        this.dragMode = false;
        this.updateStylesForState();
    }

    connectedCallback(e) {
        //console.log(`image editor connected (${this.isConnected})`, e)
    }

    dragStart(e, direction) {
        console.log('mouse down ', e.target);
        if (!this.selectedMode)
            return;

        console.log('start drag ' + direction)
        this.dragMode = true;
        this.updateStylesForState();
    }

    imageClicked(e) {
        console.log('image clicked')
        this.selectedMode = true;
        this.updateStylesForState();
        e.stopPropagation();
    }

    set imageData(imageData) {
        this.imageTag.src = imageData;
    }

    removeClicked(e) {
        this.imageTag.src = '';
        this.updateStylesForState();
    }

    updateStylesForState() {
        this.bodyDiv.classList.toggle('selected', this.selectedMode);
        this.bodyDiv.classList.toggle('dragging', this.dragMode);
    }

}

customElements.define('image-editor', ImageEditor);

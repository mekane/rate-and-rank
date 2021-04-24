const styles = `
  .body {
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 6px;
    position: relative;
  }
  
  .body * {
    user-select: none;
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
  
  button {
    appearance: none;
    cursor: pointer;
    display: none;
    font-family: arial;
    height: 20px;
    padding: 0;
    position: absolute;
    text-align: center;
    width: 20px;
  }
  
  button:focus {
    outline: 1px solid #ddd;
  }
  
  .remove {
    background: rgba(0,0,0,0.4);
    border: 1px solid #c33;
    color: #c33;    
    right: 4px;
    top: 4px;
  }
  
  .remove:hover {
    border-color: #f00;
    color: #f00;
  }

  .reset {
    background: rgba(0,0,0,0.4);
    border: 1px solid #3c3;
    color: #3c3;
    right: 32px;
    top: 4px;
  }
  
  .reset:hover {
    border-color: #0f0;
    color: #0f0;
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
  .body.selected .remove,
  .body.selected .reset {
    display: block;
  }
  
`;

function create(tagName, initialText, cssClass = '') {
    const el = document.createElement(tagName);
    el.draggable = false;
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

    dragStartPosition = {x: 0, y: 0};

    originalImageSize = {width: 0, height: 0};

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});

        const style = create('style');
        style.textContent = styles;
        shadowRoot.appendChild(style);

        const body = create('div', '', 'body');
        this.bodyDiv = body;

        const removeButton = create('button', 'x', 'remove');
        removeButton.addEventListener('click', e => this.removeClicked(e))
        body.appendChild(removeButton);

        const resetButton = create('button', 'R', 'reset');
        resetButton.addEventListener('click', e => this.resetImageSize(e))
        body.appendChild(resetButton);

        const imageTag = create('img');
        this.imageTag = imageTag;
        imageTag.addEventListener('load', e => this.saveImageSize());
        body.addEventListener('click', e => this.imageClicked(e));
        body.appendChild(imageTag);

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
        document.addEventListener('mouseup', e => this.dragEnd(e))
        document.addEventListener('mousemove', e => this.drag(e))

        const initialSrc = this.attributes.getNamedItem('src');
        if (initialSrc)
            this.imageSource = initialSrc.value;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Custom element attribute ${name}: ${newValue}`);
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
        //console.log('mouse down ', e.target);
        if (!this.selectedMode)
            return;

        //console.log('start drag ' + direction, e)
        this.dragMode = direction;
        this.dragStartPosition = {x: e.clientX, y: e.clientY};
        this.updateStylesForState();
    }

    drag(e) {
        if (!this.dragMode)
            return;

        const offset = this.dragOffset(e);

        if (Math.abs(offset.x) > Math.abs(offset.y)) {
            console.log('pin width +' + offset.x)
            this.imageTag.removeAttribute('height');
            this.imageTag.width = this.originalImageSize.width + offset.x;
        } else {
            console.log('pin height +' + offset.y)
            this.imageTag.removeAttribute('width');
            this.imageTag.height = this.originalImageSize.height + offset.y;
        }
    }

    dragOffset(e) {
        return {
            x: e.clientX - this.dragStartPosition.x,
            y: e.clientY - this.dragStartPosition.y
        };
    }

    dragEnd(e) {
        if (this.dragMode) {
            console.log('drag end');
            this.saveImageSize();
            this.cancelSelection();
        }
    }

    imageClicked(e) {
        //console.log('image clicked')
        this.selectedMode = true;
        this.updateStylesForState();
        e.stopPropagation();
    }

    set imageSource(imageData) {
        console.log('set image source ' + imageData.substr(0, 20));
        this.imageTag.src = imageData;
    }

    removeClicked(e) {
        this.imageTag.src = '';
        this.updateStylesForState();
    }

    resetImageSize(e) {
        this.imageTag.removeAttribute('height');
        this.imageTag.removeAttribute('width');
        this.saveImageSize();
    }

    saveImageSize() {
        this.originalImageSize = {
            width: this.imageTag.clientWidth,
            height: this.imageTag.clientHeight
        }
        console.log('save original image size', this.originalImageSize)
    }

    updateStylesForState() {
        this.bodyDiv.classList.toggle('selected', this.selectedMode);
        this.bodyDiv.classList.toggle('dragging', this.dragMode);
    }

}

customElements.define('image-editor', ImageEditor);

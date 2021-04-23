const styles = `
  .body {
    display: inline-block;
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
  
  .body.selected .remove {
    display: block;
  }
`;

function create(tagName, initialText, cssClass = '') {
    const el = document.createElement(tagName);
    el.textContent = initialText;
    console.log(`create(${tagName}, '${initialText}', '${cssClass}')`)
    if (cssClass.length)
        el.classList.add(cssClass);
    return el;
}

class ImageEditor extends HTMLElement {

    selectedMode = false;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});

        const style = create('style');
        style.textContent = styles;
        shadowRoot.appendChild(style);

        const body = create('div', '', 'body');
        this.bodyTag = body;

        const removeTag = create('div', 'x', 'remove');
        removeTag.addEventListener('click', e => this.removeClicked(e))
        body.appendChild(removeTag);

        const imageTag = create('img');
        imageTag.addEventListener('click', e => this.imageClicked(e));
        body.appendChild(imageTag);
        this.imageTag = imageTag;

        shadowRoot.appendChild(body);

        document.addEventListener('click', e => this.bodyClicked(e))
    }

    bodyClicked(e) {
        //console.log('body clicked')
        this.selectedMode = false;
        this.updateStylesForState();
    }

    connectedCallback(e) {
        //console.log(`image editor connected (${this.isConnected})`, e)
    }

    imageClicked(e) {
        //console.log('image clicked')
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
        this.bodyTag.classList.toggle('selected', this.selectedMode);
    }

}

customElements.define('image-editor', ImageEditor);

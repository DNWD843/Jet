export class JetDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type);
    const text = this._currentElement.props.children;
    const textNode = document.createTextNode(text);

    domElement.appendChild(textNode);

    container.appendChild(domElement);

    this._hostNode = domElement;

    return domElement;
  }
}

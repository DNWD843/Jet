export class JetDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type);
    const text = this._currentElement.props.children;
    const textNode = document.createTextNode(text);

    domElement.appendChild(textNode);

    const { children, ...props } = this._currentElement.props;

    Object.keys(props).forEach((key) => {
      domElement[key] = props[key];
    })

    container.appendChild(domElement);

    this._hostNode = domElement;

    return domElement;
  }
}

export class JetCompositeComponentWrapper {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const Component = this._currentElement.type;
    const componentInstance = new Component(this._currentElement.props);
    let element = componentInstance.render();

    while (typeof element.type === 'function') {
      // const Component = element.type;
      // const componentInstance = new Component(element.props);
      // element = componentInstance.render();
      element = (new element.type(element.props)).render();
    }

    const domComponentInstance = new JetDOMComponent(element);

    return domComponentInstance.mountComponent(container);
  }
}

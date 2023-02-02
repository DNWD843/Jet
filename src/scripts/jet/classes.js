import { JetReconciler } from "./JetReconciler.js";
import { instantiateJetComponent } from "./helpers.js";

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
    this._instance = new Component(this._currentElement.props);

    if (this._instance.componentWillMount) {
      this._instance.componentWillMount();
    }

    const markup = this.performInitialMount(container);

    if (this._instance.componentDidMount) {
      this._instance.componentDidMount();
    }

    return markup;
  }

  performInitialMount(container) {
    const renderedElement = this._instance.render();

    const child = instantiateJetComponent({
      element: renderedElement,
      domComponentClass: JetDOMComponent,
      compositeComponentClass: JetCompositeComponentWrapper,
    });

    this._renderedElement = child;

    return JetReconciler.mountComponent(child, container);
  }
}

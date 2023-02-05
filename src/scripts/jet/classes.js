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

  updateComponent(prevElement, nextElement) {
    const prevProps = prevElement.props;
    const nextProps = nextElement.props;

    this._updateDOMProperties(prevProps, nextProps);
    this._updateDOMChildren(prevProps, nextProps);

    this._currentElement = nextElement;
  }

  _updateDOMProperties(prevProps, nextProps) {
    // nothing to do! I'll explain why below
  }
  _updateDOMChildren(prevProps, nextProps) {
    const prevContent = prevProps.children;
    const nextContent = nextProps.children;

    if (!nextContent) {
      this.updateTextContent('');
    } else if (prevContent !== nextContent) {
      this.updateTextContent(String(nextContent));
    }
  }

  updateTextContent(text) {
    const node = this._hostNode;
    node.textContent = text;

    const firstChild = node.firstChild;

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === Node.TEXT_NODE ) {
      firstChild.nodeValue = text;
    }
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
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

    this._renderedComponent = child;

    return JetReconciler.mountComponent(child, container);
  }

  _updateRenderedComponent() {
    const prevComponentInstance = this._renderedComponent;
    const instance = this._instance;
    const nextRenderedElement = instance.render();

    JetReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
  }

  _performComponentUpdate(nextElement, nextProps) {
    this._currentElement = nextElement;
    const instance = this._instance;
    instance.props = nextProps;

    this._updateRenderedComponent();
  }
  updateComponent(prevElement, nextElement) {
    const nextProps = nextElement.props;
    const instance = this._instance;

    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(nextProps);
    }

    let shouldUpdate = true;

    if (instance.shouldComponentUpdate) {
      shouldUpdate = instance.shouldComponentUpdate(nextProps);
    }

    if (shouldUpdate) {
      this._performComponentUpdate(nextElement, nextProps);
    } else {
      instance.props = nextProps;
    }
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
  }
}

import { JetReconciler } from "./JetReconciler.js";
import { instantiateJetComponent } from "./helpers.js";
import { JetInstanceMap } from "./instanceMap.js";

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
    const componentInstance = new Component(this._currentElement.props);
    this._instance = componentInstance;

    JetInstanceMap.set(componentInstance, this);

    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount();
    }

    const markup = this.performInitialMount(container);

    if (componentInstance.componentDidMount) {
      componentInstance.componentDidMount();
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

  _performComponentUpdate(nextElement, nextProps, nextState) {
    this._currentElement = nextElement;
    const instance = this._instance;
    instance.props = nextProps;
    instance.state = nextState;

    this._updateRenderedComponent();
  }
  updateComponent(prevElement, nextElement) {
    const nextProps = nextElement.props;
    const instance = this._instance;

    const willReceive = prevElement !== nextElement;

    if (willReceive && instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(nextProps);
    }

    let shouldUpdate = true;

    const nextState = Object.assign({}, instance.state,this._pendingPartialState);
    this._pendingPartialState = null;

    if (instance.shouldComponentUpdate) {
      shouldUpdate = instance.shouldComponentUpdate(nextProps);
    }

    if (shouldUpdate) {
      this._performComponentUpdate(nextElement, nextProps);
    } else {
      instance.props = nextProps;
      instance.state = nextState;
    }
  }

  performUpdateIfNecessary() {
    this.updateComponent(this._currentElement, this._currentElement);
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
  }
}

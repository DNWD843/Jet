import { JetReconciler } from "./JetReconciler.js";
import { instantiateJetComponent } from "./helpers.js";
import { JetInstanceMap } from "./instanceMap.js";

export class JetDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type);
    const { children, ...props } = this._currentElement.props;

    Object.keys(props).forEach((key) => {
      domElement[key] = props[key];
    })

    if (typeof children === 'string') {
      const textNode = document.createTextNode(children);
      domElement.appendChild(textNode);
    }

    if (Array.isArray(children)) {
      children.forEach(child => {
        const component = new JetDOMComponent(child);
        const childElement = component.mountComponent(domElement);
        domElement.appendChild(childElement);
      })
    } else if (typeof children === 'object' && Object.hasOwn(children, 'type')) {
      const component = new JetDOMComponent(children);
      const childElement = component.mountComponent(domElement);
      domElement.appendChild(childElement);
    }

    container.appendChild(domElement);

    this._hostNode = domElement;

    return domElement;
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

  updateComponent(prevElement, nextElement) {
    const prevProps = prevElement.props;
    const nextProps = nextElement.props;

    this._updateDOMProperties(prevProps, nextProps);
    this._updateDOMChildren(prevProps, nextProps);

    // this._currentElement = nextElement;
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

  _processPendingState() {
    const instance = this._instance;

    if (!this._pendingPartialState) {
      return instance.state;
    }

    let nextState = instance.state;

    for (let i = 0; i < this._pendingPartialState.length; ++i) {
      const partialState = this._pendingPartialState[i];

      if (typeof partialState === 'function') {
        nextState = partialState(nextState);
      } else {
        nextState = Object.assign(nextState, partialState);
      }
    }

    this._pendingPartialState = null;

    return nextState;
  }
  updateComponent(prevElement, nextElement) {
    this._rendering = true;
    const nextProps = nextElement.props;
    const instance = this._instance;

    const willReceive = prevElement !== nextElement;

    if (willReceive && instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(nextProps);
    }

    let shouldUpdate = true;

    const nextState = this._processPendingState();

    if (instance.shouldComponentUpdate) {
      shouldUpdate = instance.shouldComponentUpdate(nextProps, nextState);
    }

    if (shouldUpdate) {
      this._performComponentUpdate(nextElement, nextProps, nextState);
    } else {
      instance.props = nextProps;
    }
    this._rendering = false;
  }

  performUpdateIfNecessary() {
    this.updateComponent(this._currentElement, this._currentElement);
  }

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
  }
}

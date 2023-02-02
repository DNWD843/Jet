import { JetCompositeComponentWrapper } from "./classes.js";
import { TopLevelWrapper } from "./TopLevelWrapper.js";
import { JetReconciler } from "./JetReconciler.js";


export const Jet = {
  createClass(spec) {
    function Constructor(props) {
      this.props = props;
    }

    Constructor.prototype = Object.assign(Constructor.prototype, spec);

    return Constructor;
  },

  createElement(type, props, children) {
    const element = {
      type,
      props: props || {},
    };

    if (children) {
      element.props.children = children;
    }

    return element;
  },

  render(element, container) {
    const wrapperElement = this.createElement(TopLevelWrapper, element);
    const componentInstance = new JetCompositeComponentWrapper(wrapperElement);

    return JetReconciler.mountComponent(componentInstance, container);
  }
};

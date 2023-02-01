import { JetCompositeComponentWrapper } from "./classes.js";
import { TopLevelWrapper } from "./TopLevelWrapper.js";


export const Jet = {
  createClass(spec) {
    function Constructor(props) {
      this.props = props;
    }

    Constructor.prototype.render = spec.render;

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

    return componentInstance.mountComponent(container);
  }
};

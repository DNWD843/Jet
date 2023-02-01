import { JetDOMComponent } from "./classes.js";

export const Jet = {
  createELement(type, props, children) {
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
    const componentInstance = new JetDOMComponent(element);
    return componentInstance.mountComponent(container);
  }
};

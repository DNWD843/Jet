import { getTopLevelComponentInContainer, renderNewRootComponent, updateRootComponent } from "./helpers.js";

export const Jet = {
  createClass(config) {
    function ComponentClass(props) {
      this.props = props;
    }

    ComponentClass.prototype = Object.assign(ComponentClass.prototype, config);

    return ComponentClass;
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
    const prevComponent = getTopLevelComponentInContainer(container);

    if (prevComponent) {
      return updateRootComponent(prevComponent, element);
    } else {
      return renderNewRootComponent.call(this, element, container);
    }
  }
};

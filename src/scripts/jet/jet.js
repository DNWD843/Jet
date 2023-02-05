import { JetCompositeComponentWrapper } from "./classes.js";
import { TopLevelWrapper } from "./TopLevelWrapper.js";
import { JetReconciler } from "./JetReconciler.js";
import { getTopLevelComponentInContainer, renderNewRootComponent, updateRootComponent } from "./helpers.js";

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
    const prevComponent = getTopLevelComponentInContainer(container);

    if (prevComponent) {
      return updateRootComponent(prevComponent, element);
    } else {
      return renderNewRootComponent.call(this, element, container);
    }
  }
};

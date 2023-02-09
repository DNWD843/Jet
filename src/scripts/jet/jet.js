import {
  getTopLevelComponentInContainer,
  mixConfigIntoComponent,
  renderNewRootComponent,
  updateRootComponent,
} from "./helpers.js";
import { JetComponent } from "./components.js";

export const Jet = {
  createClass(config) {
    function Constructor(props) {
      this.props = props;
      this.state = this.getInitialState ? this.getInitialState() : null;
    }

    Constructor.prototype = new JetComponent();
    mixConfigIntoComponent(Constructor, config);

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

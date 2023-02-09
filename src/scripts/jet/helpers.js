import { TopLevelWrapper } from "./TopLevelWrapper.js";
import { JetCompositeComponentWrapper } from "./classes.js";
import { JetReconciler } from "./JetReconciler.js";

export function instantiateJetComponent({ element, domComponentClass, compositeComponentClass }) {
  if (typeof element.type === 'string') {
    return new domComponentClass(element);
  } else if (typeof element.type === 'function') {
    return new compositeComponentClass(element);
  }
}

export function renderNewRootComponent(element, container) {
  const wrappedElement = this.createElement(TopLevelWrapper, element);
  const componentInstance = new JetCompositeComponentWrapper(wrappedElement);

  const markup = JetReconciler.mountComponent(componentInstance, container);
  container.__jetComponentInstance = componentInstance._renderedComponent;

  return markup;
}

export function getTopLevelComponentInContainer(container) {
  return container.__jetComponentInstance;
}
export function updateRootComponent(prevComponent, nextElement) {
  JetReconciler.receiveComponent(prevComponent, nextElement);
}

export function mixConfigIntoComponent(Constructor, config) {
  const proto = Constructor.prototype;
  for (const key in config) {
    proto[key] = config[key];
  }
}

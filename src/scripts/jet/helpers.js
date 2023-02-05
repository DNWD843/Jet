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

  container._jetComponentInstance = componentInstance._renderedComponent;

  return JetReconciler.mountComponent(componentInstance, container);
}

export function getTopLevelComponentInContainer(container) {
  return container._jetComponentInstance;
}
export function updateRootComponent(prevComponent, nextElement) {
  JetReconciler.receiveComponent(prevComponent, nextElement);
}

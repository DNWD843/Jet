export function instantiateJetComponent({ element, domComponentClass, compositeComponentClass }) {
  if (typeof element.type === 'string') {
    return new domComponentClass(element);
  } else if (typeof element.type === 'function') {
    return new compositeComponentClass(element);
  }
}

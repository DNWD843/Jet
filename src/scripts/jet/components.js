import { JetReconciler } from "./JetReconciler.js";

export function JetComponent() {

}

JetComponent.prototype.setState = function(partialState) {
  const internalInstance = getMyInternalInstancePlease(this);

  internalInstance._pendingPartialState = partialState;

  JetReconciler.performUpdateIfNecessary(internalInstance);
}



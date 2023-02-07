import { JetReconciler } from "./JetReconciler.js";
import { JetInstanceMap } from "./instanceMap.js";

export function JetComponent() {

}

JetComponent.prototype.setState = function(partialState) {
  const internalInstance = JetInstanceMap.get(this);
  internalInstance._pendingPartialState = partialState;

  JetReconciler.performUpdateIfNecessary(internalInstance);
}



export function TopLevelWrapper(props) {
  this.props = props;
}

TopLevelWrapper.prototype.render = function() {
  return this.props;
}

import { rootContainer } from './domNodes.js';
import { Jet } from './jet';

const H1 = Jet.createClass({
  render() {
    return Jet.createElement('h1', { className: 'content__title' }, this.props.text);
  }
})

const Text = Jet.createClass({
  render() {
    if (this.props.isTitle) {
      return Jet.createElement(H1, { text: this.props.text });
    }

    return Jet.createElement('p', { className: 'content__subTitle'}, this.props.text)
  }
})

Jet.render(
  Jet.createElement(Text, { isTitle: true, text: 'Hello, Jet!' }),
  rootContainer,
);

Jet.render(
  Jet.createElement(Text, { isTitle: false, text: 'Let`s talk about Jet' }),
  rootContainer,
);

Jet.render(
  Jet.createElement('button', { type: 'button', className: 'content__button' }, 'simple button'),
  rootContainer,
);

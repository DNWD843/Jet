import { rootContainer } from './domNodes.js';
import { Jet } from './jet';

const H1 = Jet.createClass({
  render() {
    return Jet.createElement('h1', { ...this.props });
  }
})

const Text = Jet.createClass({
  componentWillMount() {
    console.log('Text will be mounted');
  },

  componentDidMount() {
    console.log('Text was mounted');
  },

  render() {
    const { isTitle, ...props } = this.props;

    if (isTitle) {
      return Jet.createElement(H1, { ...props });
    }

    return Jet.createElement('p', { ...props })
  }
})

const textProps = { isTitle: true, className: 'content__title' };

Jet.render(
  Jet.createElement(Text, textProps, 'Hello, Jet!'),
  rootContainer,
);

// Jet.render(
//   Jet.createElement(Text, { isTitle: false, className: 'content__subTitle' }, 'Let`s talk about Jet?'),
//   rootContainer,
// );

// Jet.render(
//   Jet.createElement('button', { type: 'button', className: 'content__button' }, 'Press to know more'),
//   rootContainer,
// );

setTimeout(() => {
  Jet.render(
    Jet.createElement(Text, textProps, 'Hello again, updated Jet!'),
    rootContainer,
  );
}, 2000);

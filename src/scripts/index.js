import { rootContainer } from './domNodes.js';
import { Jet } from './jet';

const MyComponent = Jet.createClass({
  componentWillMount() {
    this.renderCount = 0;
  },

  getInitialState() {
    return { message: 'from getInitialState' };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ message: 'from componentWillReceiveProps' });
  },

  render() {
    this.renderCount += 1;

    return Jet.createElement('h1', null, 'this is render ' + this.renderCount + '\n with state: ' + this.state?.message + ', and this prop: ' + this.props.prop)
  }
});

Jet.render(Jet.createElement(MyComponent, { prop: 'first prop' }), rootContainer);

setTimeout(() => {
  Jet.render(Jet.createElement(MyComponent, { prop: 'second prop' }), rootContainer);
}, 2000);

// const H1 = Jet.createClass({
//   render() {
//     return Jet.createElement('h1', { ...this.props });
//   }
// })
//
// const Text = Jet.createClass({
//   componentWillMount() {
//     console.log('Text will be mounted');
//   },
//
//   componentDidMount() {
//     console.log('Text was mounted');
//   },
//
//   render() {
//     const { isTitle, ...props } = this.props;
//
//     if (isTitle) {
//       return Jet.createElement(H1, { ...props });
//     }
//
//     return Jet.createElement('p', { ...props })
//   }
// })
//
// const textProps = { isTitle: true, className: 'content__title' };
//
// Jet.render(
//   Jet.createElement(Text, textProps, 'Hello, Jet!'),
//   rootContainer,
// );

// Jet.render(
//   Jet.createElement(Text, { isTitle: false, className: 'content__subTitle' }, 'Let`s talk about Jet?'),
//   rootContainer,
// );

// Jet.render(
//   Jet.createElement('button', { type: 'button', className: 'content__button' }, 'Press to know more'),
//   rootContainer,
// );

// setTimeout(() => {
//   Jet.render(
//     Jet.createElement(Text, textProps, 'Hello again, updated Jet!'),
//     rootContainer,
//   );
// }, 2000);

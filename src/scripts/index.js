import { rootContainer } from './domNodes.js';
import { Jet } from './jet';

const titleElement = Jet.createELement('h1', null, 'Hello, Jet!');

Jet.render(titleElement, rootContainer);


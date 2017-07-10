import * as react from './react';
import * as refs from './refs';
import * as renderers from './renderers';
import RenderData from './renderers/renderData';
import Renderer from './renderers/renderer';
import * as template from './template';
import * as types from './types';

import './theme';

const Formatron = {
  react,
  refs,
  renderers: renderers.default,
  template,
  types
};

Formatron.refs.parseRef = refs.default;
Formatron.template.parseTemplate = template.default;

Formatron.renderers.valueRenderers = renderers.valueRenderers;
Formatron.renderers.RenderData = RenderData;
Formatron.renderers.Renderer = Renderer;

export default Formatron;


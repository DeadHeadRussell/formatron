import Renderers from '~/renderers';

import registerButtonRenderer from './button';
import registerCalendarRenderer from './calendar';
import registerCheckboxRenderer from './checkbox';
import registerComputedRenderer from './computed';
import registerConditionRenderer from './condition';
import registerCurrencyRenderer from './currency';
import registerDropDownRenderer from './dropDown';
import registerFunctionRenderer from './function';
import registerGridRenderer from './grid';
import registerHeaderRenderer from './header';
import registerLinkRenderer from './link';
import registerMethodRenderer from './method';
import registerNumberRenderer from './number';
import registerPercentRenderer from './percent';
import registerPropertyRenderer from './property';
import registerStaticRenderer from './static';
import registerSwitchRenderer from './switch';
import registerTableRenderer from './table';
import registerTabsRenderer from './tabs';
import registerTemplateRenderer from './template';
import registerTextRenderer from './text';
import registerValueRenderer from './value';
import registerVariableRenderer from './variable';

function createReactTypeRenderers() {
  const types = {};

  registerButtonRenderer(types);
  registerCalendarRenderer(types);
  registerCheckboxRenderer(types);
  registerComputedRenderer(types);
  registerConditionRenderer(types);
  registerCurrencyRenderer(types);
  registerDropDownRenderer(types);
  registerFunctionRenderer(types);
  registerGridRenderer(types);
  registerHeaderRenderer(types);
  registerLinkRenderer(types);
  registerMethodRenderer(types);
  registerNumberRenderer(types);
  registerPercentRenderer(types);
  registerPropertyRenderer(types);
  registerStaticRenderer(types);
  registerSwitchRenderer(types);
  registerTableRenderer(types);
  registerTabsRenderer(types);
  registerTemplateRenderer(types);
  registerTextRenderer(types);
  registerValueRenderer(types);
  registerVariableRenderer(types);

  return types;
}

/**
 * A set of renderers to be used with React.js.
 */
export default new Renderers(createReactTypeRenderers());


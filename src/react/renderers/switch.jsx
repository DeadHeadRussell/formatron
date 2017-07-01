import SwitchType from '~/types/view/value/switch';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';

const Switch = ({viewType, renderData, renderers, renderMethod}) => {
  const display = viewType.switch(renderData, renderers);
  return display ?
    renderers[rendererMethod](display, renderData) :
    null;
};

const SwitchField = withFormLabel(Switch);
const StaticSwitchField = withStaticLabel(Switch);

export default ReactRenderer.register(SwitchType, SwitchField, StaticSwitchField, null, Switch, Switch);


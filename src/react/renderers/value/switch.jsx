import SwitchType from '~/types/view/value/switch';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableSimpleFilter} from '../tableHelpers';

const Switch = ({viewType, renderData, renderers, rendererMethod}) => {
  const display = viewType.switch(renderData);
  return display ?
    renderers[rendererMethod](display, renderData) :
    null;
};

const SwitchField = withSimpleLabel(Switch);
const StaticSwitchField = withStaticLabel(Switch);

export default ReactRenderer.register(
  SwitchType,
  SwitchField,
  StaticSwitchField,
  TableSimpleFilter,
  Switch,
  Switch
);


import StaticType from '~/types/view/display/static';

import {withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';

const StaticField = withStaticLabel(({viewType, renderData, renderers}) => {
  return renderers.renderStaticField(viewType.getDisplay(), renderData);
});

const Static = ({viewType, renderData, renderers}) => {
  return renderers.renderStaticTableCell(viewType.getDisplay(), renderData);
};

const StaticFilter = ({viewType, renderData}) => {
  return renderers.renderFilter(viewType.getDisplay(), renderData);
};

export default ReactRenderer.register(
  StaticType,
  StaticField,
  StaticField,
  StaticFilter,
  Static,
  Static
);


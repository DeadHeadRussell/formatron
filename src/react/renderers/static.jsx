import StaticType from '~/types/view/display/static';

import ReactRenderer from './reactRenderer';

const StaticField = ({viewType, renderData, renderers}) => {
  return renderers.renderStaticField(viewType.getDisplay(), renderData);
};

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


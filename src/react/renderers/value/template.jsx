import TemplateType from '~/types/view/value/template';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableSimpleFilter} from '../tableHelpers';
import {valueLabelRenderer} from './';

const Template = valueLabelRenderer(TemplateType);
const TemplateField = withSimpleLabel(Template);
const StaticTemplateField = withStaticLabel(Template);

export default ReactRenderer.register(
  TemplateType,
  TemplateField,
  StaticTemplateField,
  TableSimpleFilter,
  Template,
  Template
);


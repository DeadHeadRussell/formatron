import TemplateType from '~/types/view/value/template';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {valueLabelRenderer} from './value';

const Template = valueLabelRenderer(TemplateType);
const TemplateField = withFormLabel(Template);
const StaticTemplateField = withStaticLabel(Template);

export default ReactRenderer.register(TemplateType, TemplateField, StaticTemplateField, null, Template, Template);


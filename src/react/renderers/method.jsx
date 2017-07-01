import MethodType from '~/types/view/value/method';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {valueLabelRenderer} from './value';

const Method = valueLabelRenderer(MethodType);
const MethodField = withFormLabel(Method);
const StaticMethodField = withStaticLabel(Method);

export default ReactRenderer.register(MethodType, MethodField, StaticMethodField, null, Method, Method);


import MethodType from '~/types/view/value/method';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableSimpleFilter} from '../tableHelpers';
import {valueLabelRenderer} from './';

const Method = valueLabelRenderer(MethodType);
const MethodField = withSimpleLabel(Method);
const StaticMethodField = withStaticLabel(Method);

export default ReactRenderer.register(
  MethodType,
  MethodField,
  StaticMethodField,
  TableSimpleFilter,
  Method,
  Method
);


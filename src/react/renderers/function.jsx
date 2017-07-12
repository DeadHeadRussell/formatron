import FunctionType from '~/types/view/value/function';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';
import {valueLabelRenderer} from './value';

const Function = valueLabelRenderer(FunctionType);
const FunctionField = withFormLabel(Function);
const StaticFunctionField = withStaticLabel(Function);

export default ReactRenderer.register(
  FunctionType,
  FunctionField,
  StaticFunctionField,
  TableSimpleFilter,
  Function,
  Function
);


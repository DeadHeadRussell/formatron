import FunctionType from '~/types/view/value/function';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableSimpleFilter} from '../tableHelpers';
import {valueLabelRenderer} from './';

const Function = valueLabelRenderer(FunctionType);
const FunctionField = withSimpleLabel(Function);
const StaticFunctionField = withStaticLabel(Function);

export default ReactRenderer.register(
  FunctionType,
  FunctionField,
  StaticFunctionField,
  TableSimpleFilter,
  Function,
  Function
);


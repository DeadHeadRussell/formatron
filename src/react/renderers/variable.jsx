import VariableType from '~/types/view/value/variable';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';
import {valueLabelRenderer} from './value';

const Variable = valueLabelRenderer(VariableType);
const VariableField = withFormLabel(VariableField);
const StaticVariableField = withStaticLabel(VariableField);

export default ReactRenderer.register(
  VariableType,
  VariableField,
  StaticVariableField,
  TableSimpleFilter,
  Variable,
  Variable
);


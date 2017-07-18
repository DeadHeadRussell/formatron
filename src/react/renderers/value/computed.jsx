import ComputedType from '~/types/view/value/computed';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {TableSimpleFilter} from '../tableHelpers';
import {valueLabelRenderer} from './';

const Computed = valueLabelRenderer(ComputedType);
const ComputedField = withSimpleLabel(Computed);
const StaticComputedField = withStaticLabel(Computed);

export default ReactRenderer.register(
  ComputedType,
  ComputedField,
  StaticComputedField,
  TableSimpleFilter,
  Computed,
  Computed
);


import ComputedType from '~/types/view/value/computed';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {valueLabelRenderer} from './value';

const Computed = valueLabelRenderer(ComputedType);
const ComputedField = withFormLabel(Computed);
const StaticComputedField = withStaticLabel(Computed);

export default ReactRenderer.register(ComputedType, ComputedField, StaticComputedField, null, Computed, Computed);


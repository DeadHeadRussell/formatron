import PropertyType from '~/types/view/value/property';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';
import {valueLabelRenderer} from './value';

const Property = valueLabelRenderer(PropertyType);
const PropertyField = withFormLabel(Property);
const StaticPropertyField = withStaticLabel(Property);

export default ReactRenderer.register(
  PropertyType,
  PropertyField,
  StaticPropertyField,
  TableSimpleFilter,
  Property,
  Property
);


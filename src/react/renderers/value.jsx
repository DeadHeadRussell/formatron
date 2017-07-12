import ValueType from '~/types/view/value';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';

export const valueLabelRenderer = ViewType => {
  return ({viewType, renderData}) => (
    <p className='formatron-static-value'>
      {viewType.getDisplay(renderData)}
    </p>
  );
}

const Value = valueLabelRenderer(ValueType);
const ValueField = withFormLabel(Value);
const StaticValueField = withStaticLabel(Value);

export default ReactRenderer.register(
  ValueType,
  ValueField,
  StaticValueField,
  TableSimpleFilter,
  Value,
  Value
);


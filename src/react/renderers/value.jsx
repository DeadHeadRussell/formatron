import ValueType from '~/types/view/value';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';

export const valueLabelRenderer = ViewType => {
  return ({viewType, renderData, renderers}) => (
    <p className='formatron-static-value'>
      {viewType.getDisplay(renderData, renderers)}
    </p>
  );
}

const Value = valueLabelRenderer(ValueType);
const ValueField = withFormLabel(Value);
const StaticValueField = withStaticLabel(Value);

export default ReactRenderer.register(ValueType, ValueField, StaticValueField, null, Value, Value);


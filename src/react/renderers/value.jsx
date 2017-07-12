import classNames from 'classnames';

import ValueType from '~/types/view/value';

import {withSimpleLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';

export const valueLabelRenderer = ViewType => {
  return ({viewType, renderData}) => {
    const display = viewType.getDisplay(renderData);
    return (
      <p className={
        classNames('formatron-static-value', {
          ['formatron-value-empty']: !display
        })
      }>
        {display}
      </p>
    );
  };
}

const Value = valueLabelRenderer(ValueType);
const ValueField = withSimpleLabel(Value);
const StaticValueField = withStaticLabel(Value);

export default ReactRenderer.register(
  ValueType,
  ValueField,
  StaticValueField,
  TableSimpleFilter,
  Value,
  Value
);


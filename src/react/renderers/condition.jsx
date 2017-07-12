import ConditionType from '~/types/view/value/condition';

import {withSimpleLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';
import {TableSimpleFilter} from './tableHelpers';

const Condition = ({viewType, renderData, renderers, rendererMethod}) => {
  const trueType = viewType.getTrueType();
  const falseType = viewType.getFalseType();

  return viewType.test(renderData) ? (
    renderers[rendererMethod](trueType, renderData)
  ) : falseType ? (
    renderers[rendererMethod](falseType, renderData)
  ) : null;
};

const ConditionField = withSimpleLabel(Condition);
const StaticConditionField = withStaticLabel(Condition);

export default ReactRenderer.register(
  ConditionType,
  ConditionField,
  StaticConditionField,
  TableSimpleFilter,
  Condition,
  Condition
);


import ConditionType from '~/types/view/value/condition';

import {withFormLabel, withStaticLabel} from './formHelpers';
import ReactRenderer from './reactRenderer';

const Condition = ({viewType, renderData, renderers, rendererMethod}) => {
  const trueType = viewType.getTrueType();
  const falseType = viewType.getFalseType();

  return viewType.test(renderData, renderers) ? (
    renderers[rendererMethod](trueType, renderData)
  ) : falseType ? (
    renderers[rendererMethod](falseType, renderData)
  ) : null;
};

const ConditionField = withFormLabel(Condition);
const StaticConditionField = withStaticLabel(Condition);

export default ReactRenderer.register(ConditionType, ConditionField, StaticConditionField, null, Condition, Condition);


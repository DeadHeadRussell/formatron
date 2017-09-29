import ComputedType from '~/types/view/value/computed';
import FunctionType from '~/types/view/value/function';
import MethodType from '~/types/view/value/method';
import PropertyType from '~/types/view/value/property';
import TemplateType from '~/types/view/value/template';
import ValueType from '~/types/view/value';
import VariableType from '~/types/view/value/variable';

import {withSimpleLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {StaticTableCellRenderer, TableSimpleFilter} from '../tableHelpers';

export default [
  ComputedType,
  FunctionType,
  MethodType,
  PropertyType,
  TemplateType,
  ValueType,
  VariableType
]
  .map(ViewType => ReactRenderer.register(
    ViewType,
    withSimpleLabel(StaticTableCellRenderer),
    withStaticLabel(StaticTableCellRenderer),
    TableSimpleFilter,
    StaticTableCellRenderer,
    StaticTableCellRenderer
  ));


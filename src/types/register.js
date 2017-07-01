import BoolType from './data/bool';
import DateType from './data/date';
import EnumType from './data/enum';
import ListType from './data/list';
import MapType from './data/map';
import NumberDataType from './data/number';
import TextDataType from './data/text';

import ButtonType from './view/button';
import DataType from './view/data';
import CalendarType from './view/data/calendar';
import CheckboxType from './view/data/checkbox';
import CurrencyType from './view/data/currency';
import DropDownType from './view/data/dropDown';
import LinkType from './view/data/link';
import NumberType from './view/data/number';
import PercentType from './view/data/percent';
import TableType from './view/data/table';
import TextType from './view/data/text';
import GridType from './view/display/grid';
import HeaderType from './view/display/header';
import StaticType from './view/display/static';
import TabsType from './view/display/tabs';
import ValueType from './view/value';
import ComputedType from './view/value/computed';
import ConditionType from './view/value/condition';
import FunctionType from './view/value/function';
import MethodType from './view/value/method';
import PropertyType from './view/value/property';
import SwitchType from './view/value/switch';
import TemplateType from './view/value/template';
import VariableType from './view/value/variable';

export function registerDataTypes(register) {
  register(BoolType);
  register(DateType);
  register(EnumType);
  register(ListType);
  register(MapType);
  register(NumberDataType);
  register(TextDataType);
}

export function registerViewTypes(register) {
  register(ButtonType);
  register(DataType);
  register(CalendarType);
  register(CheckboxType);
  register(CurrencyType);
  register(DropDownType);
  register(LinkType);
  register(NumberType);
  register(PercentType);
  register(TableType);
  register(TextType);
  register(GridType);
  register(HeaderType);
  register(StaticType);
  register(TabsType);
  register(ValueType);
  register(ComputedType);
  register(ConditionType);
  register(FunctionType);
  register(MethodType);
  register(PropertyType);
  register(SwitchType);
  register(TemplateType);
  register(VariableType);
}


import registerBoolType from './data/bool';
import registerContactInfoType from './data/contactInfo';
import registerDateType from './data/date';
import registerEnumType from './data/enum';
import registerListType from './data/list';
import registerNumberType from './data/number';
import registerRangeType from './data/range';
//import registerSectionType from './data/section';
import registerTextType from './data/text';

import registerButtonType from './view/button';
import registerColumnsType from './view/columns';
import registerComputedType from './view/computed';
import registerConditionType from './view/condition';
import registerDataType from './view/data';
import registerHeaderType from './view/header';
import registerFunctionType from './view/function';
import registerMethodType from './view/method';
import registerPropertyType from './view/property';
import registerRowType from './view/row';
import registerSwitchType from './view/switch';
import registerTabsType from './view/tabs';
import registerTemplateType from './view/template';
import registerValueType from './view/value';
import registerVariableType from './view/variable';

export function registerDataTypes(register) {
  registerBoolType(register);
  registerContactInfoType(register);
  registerDateType(register);
  registerEnumType(register);
  registerListType(register);
  registerNumberType(register);
  registerRangeType(register);
  //registerSectionType(register);
  registerTextType(register);
}

export function registerViewTypes(register) {
  registerButtonType(register);
  registerColumnsType(register);
  registerComputedType(register);
  registerConditionType(register);
  registerDataType(register);
  registerFunctionType(register);
  registerHeaderType(register);
  registerMethodType(register);
  registerPropertyType(register);
  registerRowType(register);
  registerSwitchType(register);
  registerTabsType(register);
  registerTemplateType(register);
  registerValueType(register);
  registerVariableType(register);
}


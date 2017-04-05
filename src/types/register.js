import registerBoolType from './data/bool';
import registerContactInfoType from './data/contactInfo';
import registerDateType from './data/date';
import registerEnumType from './data/enum';
import registerListType from './data/list';
import registerNumberType from './data/number';
import registerRangeType from './data/range';
//import registerSectionType from './data/section';
import registerTextType from './data/text';

import registerButtonType from './form/button';
import registerColumnsType from './form/columns';
import registerComputedType from './form/computed';
import registerConditionType from './form/condition';
import registerDataType from './form/data';
import registerHeaderType from './form/header';
import registerFunctionType from './form/function';
import registerMethodType from './form/method';
import registerPropertyType from './form/property';
import registerRowType from './form/row';
import registerSwitchType from './form/switch';
import registerTabsType from './form/tabs';
import registerFormTemplateType from './form/template';
import registerValueType from './form/value';
import registerVariableType from './form/variable';

import registerRefType from './table/ref';
import registerTableTemplateType from './table/template';

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

export function registerFormTypes(register) {
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
  registerFormTemplateType(register);
  registerValueType(register);
  registerVariableType(register);
}

export function registerTableTypes(register) {
  registerRefType(register);
  registerTableTemplateType(register);
}


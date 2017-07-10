import Renderers from '~/renderers';

import registerButton from './button';
import registerCalendar from './calendar';
import registerCheckbox from './checkbox';
import registerComputed from './computed';
import registerCondition from './condition';
import registerCurrency from './currency';
import registerDropDown from './dropDown';
import registerFunction from './function';
import registerGrid from './grid';
import registerHeader from './header';
import registerLink from './link';
import registerMethod from './method';
import registerNumber from './number';
import registerPercent from './percent';
import registerProperty from './property';
import registerStatic from './static';
import registerSwitch from './switch';
import registerTable from './table';
import registerTabs from './tabs';
import registerTemplate from './template';
import registerText from './text';
import registerValue from './value';
import registerVariable from './variable';

/**
 * A set of renderers to be used with React.js.
 */
export default new Renderers();

registerButton();
registerCalendar();
registerCheckbox();
registerComputed();
registerCondition();
registerCurrency();
registerDropDown();
registerFunction();
registerGrid();
registerHeader();
registerLink();
registerMethod();
registerNumber();
registerPercent();
registerProperty();
registerStatic();
registerSwitch();
registerTable();
registerTabs();
registerTemplate();
registerText();
registerValue();
registerVariable();


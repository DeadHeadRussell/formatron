import Renderers from '~/renderers';

import registerButton from './button';

import registerCalendar from './data/calendar';
import registerCheckbox from './data/checkbox';
import registerCurrency from './data/currency';
import registerDropDown from './data/dropDown';
import registerLink from './data/link';
import registerNumber from './data/number';
import registerPercent from './data/percent';
import registerTable from './data/table';
import registerText from './data/text';

import registerGrid from './display/grid';
import registerHeader from './display/header';
import registerStatic from './display/static';
import registerTabs from './display/tabs';

import registerValueTypes from './value';
import registerCondition from './value/condition';
import registerSwitch from './value/switch';

/**
 * A set of renderers to be used with React.js.
 */
const reactRenderers = new Renderers();
export default reactRenderers;

registerButton(reactRenderers);

registerCalendar(reactRenderers);
registerCheckbox(reactRenderers);
registerCurrency(reactRenderers);
registerDropDown(reactRenderers);
registerLink(reactRenderers);
registerNumber(reactRenderers);
registerPercent(reactRenderers);
registerTable(reactRenderers);
registerText(reactRenderers);

registerGrid(reactRenderers);
registerHeader(reactRenderers);
registerStatic(reactRenderers);
registerTabs(reactRenderers);

registerValueTypes.forEach(register => register(reactRenderers));
registerCondition(reactRenderers);
registerSwitch(reactRenderers);


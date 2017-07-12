import Label from '~/react/components/label';
import HeaderType from '~/types/view/display/header';

import ReactRenderer from './reactRenderer';

const Header = ({viewType, renderData}) => (
  <div className='formatron-header'>
    <Label>{viewType.getLabel(renderData)}</Label>
  </div>
);

export default ReactRenderer.register(
  HeaderType,
  Header,
  Header
);


import Label from '~/react/components/label';
import ButtonType from '~/types/view/button';

import ReactRenderer from './reactRenderer';

const Button = ({viewType, renderData}) => {
  const args = viewType.getArgs().toArray();

  return <button
    className='formatron-button'
    type='button'
    onClick={() => renderData.options.onButtonClick(...args)}
  >
    <Label>{viewType.getLabel(renderData)}</Label>
  </button>;
};

export default ReactRenderer.register(ButtonType, Button, Button, null, Button, Button);


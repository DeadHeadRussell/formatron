import Select from 'react-select';
import TetheredComponent from 'react-tether';

import 'react-select/dist/react-select.css';

export default class TetheredSelect extends Select {
  constructor(props) {
    super(props);
    this.renderOuter = this._renderOuter;
  }

  _renderOuter(...args) {
    const menu = super.renderOuter.call(this, ...args);
    if (!menu) {
      return;
    }

    const selectWidth = this.wrapper ?
      this.wrapper.offsetWidth :
      null;

    return <TetheredComponent
      renderElementTo='body'
      attachment='top left'
      targetAttachment='top left'
      constraints={[{
        to: 'window',
        attachment: 'together',
        pin: ['top']
      }]}
    >
      <div />
      {React.cloneElement(menu, {
        style: {
          ...(menu.props.style || {}),
          position: 'static',
          width: selectWidth
        }
      })}
    </TetheredComponent>;
  }
}


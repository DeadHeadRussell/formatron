import {DateField} from 'react-date-picker';
import ReactDOM from 'react-dom';
import TetheredComponent from 'react-tether';

import 'react-date-picker/index.css';

export default class TetheredDateField extends DateField {
  constructor(props) {
    super(props);

    Object.getOwnPropertyNames(DateField.prototype)
      .filter(name =>
        name != 'constructor' &&
        name != 'render' &&
        typeof TetheredDateField.prototype[name] == 'function'
      )
      .forEach(name => this[name] = this[name].bind(this));

    this.setState = this.setState.bind(this);
    this.renderPicker = this.renderPicker.bind(this);
  }

  renderPicker(...args) {
    const picker = super.renderPicker(...args);
    if (!picker) {
      return;
    }

    const tetherTargetStyle = {
      position: 'absolute',
      top: '100%',
      left: 0
    };

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
      <div style={tetherTargetStyle} />
      <div className='react-date-field react-date-field--theme-default'>
        {picker}
      </div>
    </TetheredComponent>;
  }

  render() {
    const elem = super.render();
    return React.cloneElement(elem, {
      style: {
        position: 'relative'
      }
    });
  }
}


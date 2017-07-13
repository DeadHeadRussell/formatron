import classNames from 'classnames';
import Select from 'react-virtualized-select';
import TetheredComponent from 'react-tether';

export default class TetheredSelect extends Select {
  constructor(props) {
    super(props);

    this._renderMenu = this._renderTetheredMenu.bind(this);
    this._setSelectRef = this._setTetheredSelectRef.bind(this);
  }

  _renderTetheredMenu(...args) {
    const menu = super._renderMenu.call(this, ...args);
    if (!menu) {
      return;
    }

    const wrapper = this._selectRef && this._selectRef.wrapper;
    const width = wrapper ?
      wrapper.offsetWidth :
      undefined;

    return (
      <TetheredComponent
        classes={{
          element: 'formatron-tether-element-top'
        }}
        renderElementTo='body'
        attachment='top left'
        targetAttachment='top left'
        constraints={[{
          to: 'scrollParent',
          attachment: 'together'
        }, {
          to: 'window',
          attachment: 'together'
        }]}
      >
        <div />
        <div
          className={classNames('formatron-tethered-select-menu', this.props.tetheredClassName)}
          style={{width}}
          onMouseDown={this.handleMouseDown}
        >
          {menu}
        </div>
      </TetheredComponent>
    );
  }

  handleMouseDown = (event) => {
    event.preventDefault();
  }

  _setTetheredSelectRef(...args) {
    super._setSelectRef.call(this, ...args);
    if (this._selectRef) {
      this._selectRef.renderClear = this._renderClear.bind(this._selectRef);
    }
  }

  // This function is copied from the react-select source, but instead of
  // returning null for all falsy values, it only returns null if the value is
  // null or undefined (or length of 0 for multi values).
  _renderClear() {
		if (!this.props.clearable ||
        (typeof this.props.value == 'undefined' || this.props.value === null) ||
        (typeof this.props.value == 'string' && !this.props.value.length) ||
        (this.props.multi && !this.props.value.length) ||
        this.props.disabled ||
        this.props.isLoading) {
      return;
    }

		const clear = this.props.clearRenderer();

		return (
			<span
        className='Select-clear-zone'
        title={this.props.multi ?
          this.props.clearAllText :
          this.props.clearValueText
        }
				aria-label={this.props.multi ?
          this.props.clearAllText :
          this.props.clearValueText
        }
				onMouseDown={this.clearValue}
				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}
				onTouchEnd={this.handleTouchEndClearValue}
			>
				{clear}
			</span>
		);
  }
}


export function withDataRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {
      getError,
      isDisabled,
      onChange,
      onBlur,
      onButtonClick,
    } = renderData.options;

    const ref = viewType.getRef();
    const disabled = isDisabled(ref) || !viewType.isEditable();
    const error = getError(ref);
    const placeholder = viewType.getPlaceholder();

    const {field, value} = viewType.getFieldAndValue(renderData);

    return (
      <WrappedComponent
        viewType={viewType}
        renderData={renderData}
        field={field}
        value={value}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        onChange={value => onChange(ref, value)}
        onBlur={() => onBlur(ref)}
        onButtonClick={(...args) => onButtonClick(ref, ...args)}
      />
    );
  };
}

export function withChangeOnBlurRenderer(WrappedComponent) {
  class DataRenderer extends React.Component {
    constructor(props) {
      super(props);
      this.state = this.createInitialState(props);
      this.maybeUpdateWithConvertedValue();
    }

    createInitialState(props) {
      return props.viewType.getFieldAndValue(props.renderData);
    }

    componentWillReceiveProps(newProps) {
      if (newProps.renderData != this.props.renderData) {
        this.setState(this.createInitialState(newProps));
        this.maybeUpdateWithConvertedValue();
      }
    }

    maybeUpdateWithConvertedValue() {
      const convertedValue = this.convertInput();
      console.log('converted', convertedValue, 'value', this.state.value);
      if (this.state.value == convertedValue) return;
      const {viewType, renderData} = this.props;
      const ref = viewType.getRef();
      console.log('onchange', convertedValue);
      renderData.options.onChange(ref, convertedValue);
    }

    convertInput() {
      const {viewType} = this.props;
      const parsedInput = viewType.parseInput
        ? viewType.parseInput(this.state.value)
        : this.state.field.parseInput
          ? this.state.field.parseInput(this.state.value)
          : this.state.value;
      const convertedInput = this.state.field.format
        ? this.state.field.format(parsedInput)
        : parsedInput;
      return convertedInput;
    }

    onKeyDown = e => {
      if (e.which == 13) {
        this.onBlur();
      }
    };

    onChange = value => {
      this.setState({value});
    };

    onBlur = () => {
      console.log('onBlur', this.state.value);
      const convertedValue = this.convertInput();
      const {viewType, renderData} = this.props;
      const ref = viewType.getRef();
      console.log('blur onchange', convertedValue);
      renderData.options.onChange(ref, convertedValue);
      renderData.options.onBlur(ref);
    };

    render() {
      const {viewType, renderData} = this.props;
      const {getError, isDisabled, onButtonClick} = renderData.options;

      const ref = viewType.getRef();
      const disabled = isDisabled(ref) || !viewType.isEditable();
      const error = getError(ref);
      const placeholder = viewType.getPlaceholder();

      return (
        <div onKeyDown={this.onKeyDown}>
          <WrappedComponent
            viewType={viewType}
            renderData={renderData}
            field={this.state.field}
            value={this.state.value}
            disabled={disabled}
            error={error}
            placeholder={placeholder}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onButtonClick={(...args) => onButtonClick(ref, ...args)}
          />
        </div>
      );
    }
  }

  return DataRenderer;
}

export function withStaticRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {field, value} = viewType.getFieldAndValue(renderData);

    return (
      <WrappedComponent
        viewType={viewType}
        renderData={renderData}
        field={field}
        value={value}
      />
    );
  };
}

export function withDisplayRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {dataType, dataValue} = renderData;

    const ref = viewType.getRef();
    const {field, value: rawValue} = dataType.getFieldAndValue(dataValue, ref);

    const value = viewType.getDisplay(renderData);

    return (
      <WrappedComponent
        viewType={viewType}
        renderData={renderData}
        field={field}
        value={value}
      />
    );
  };
}

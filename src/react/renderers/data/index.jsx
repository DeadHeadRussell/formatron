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
        onChange={value => onChange(ref, value, viewType.getLabel(renderData))}
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
    }

    createInitialState(props) {
      const state = props.viewType.getFieldAndValue(props.renderData);
      if (state.field && state.field.format) {
        state.value = state.field.format(state.value);
      }
      return state;
    }

    componentWillReceiveProps(newProps) {
      if (newProps.renderData != this.props.renderData) {
        this.setState(this.createInitialState(newProps));
      }
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
      const value = this.state.field.format
        ? this.state.field.format(this.state.value)
        : this.state.value;
      this.setState({value});
      const {viewType, renderData} = this.props;
      const ref = viewType.getRef();
      renderData.options.onChange(ref, this.getParsedInput(value), viewType.getLabel(renderData));
      renderData.options.onBlur(ref);
    };

    getParsedInput(value) {
      const {viewType} = this.props;
      return viewType.parseInput
        ? viewType.parseInput(value)
        : this.state.field.parseInput
          ? this.state.field.parseInput(value)
          : value;
    }

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
    const field = viewType.getField(renderData);
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

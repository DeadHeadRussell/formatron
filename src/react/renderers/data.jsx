export function withDataRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {getError, isDisabled, onChange, onBlur, onButtonClick} = renderData.options;

    const {field, value} = viewType.getFieldAndValue(renderData);
    const ref = viewType.getRef();

    const disabled = isDisabled(ref) || !viewType.isEditable();
    const error = getError(ref);
    const placeholder = viewType.getPlaceholder(field);

    function parseInput(value) {
      return viewType.parseInput ?
        viewType.parseInput(value) :
        field.parseInput ?
          field.parseInput(value) :
          value;
    }

    return <WrappedComponent
      viewType={viewType}
      renderData={renderData}
      field={field}
      value={value}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      onChange={value => onChange(ref, parseInput(value))}
      onBlur={() => onBlur(ref)}
      onButtonClick={(...args) => onButtonClick(ref, ...args)}
    />;
  };
}

export function withStaticRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {field, value} = viewType.getFieldAndValue(renderData);
    return <WrappedComponent
      viewType={viewType}
      renderData={renderData}
      field={field}
      value={value}
    />;
  };
}

export function withDisplayRenderer(WrappedComponent) {
  return ({viewType, renderData}) => {
    const {dataType, dataValue} = renderData;

    const ref = viewType.getRef();
    const {field, rawValue} = dataType.getFieldAndValue(dataValue, ref);
    const value = viewType.getDisplay(renderData);

    return <WrappedComponent
      viewType={viewType}
      renderData={renderData}
      field={field}
      value={value}
    />;
  };
}



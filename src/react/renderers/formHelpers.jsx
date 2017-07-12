import classNames from 'classnames';

import Label from '~/react/components/label';

export const withFormLabel = (WrappedComponent) => {
  return props => {
    const {viewType, renderData} = props;
    const {isDisabled, getError} = renderData.options;

    const ref = viewType.getRef && viewType.getRef();
    const {disabled, error, field} = ref ? {
      disabled: isDisabled(ref) || !viewType.isEditable(),
      error: getError(ref),
      ...viewType.getFieldAndValue(renderData)
    } : {
      disabled: true
    };

    const required = field && field.isRequired();

    return (
      <label
        className={classNames('formatron-field', `formatron-field-${viewType.constructor.typeName}`, {
          'formatron-disabled': !!disabled,
          'formatron-error': !!error
        })}
        data-error={error}
      >
        <Label required={required}>
          {viewType.getLabel(renderData)}
        </Label>

        <div className='formatron-field-wrapper'>
          <WrappedComponent {...props} />
        </div>
      </label>
    );
  };
};

export const withSimpleLabel = (WrappedComponent) => {
  return props => {
    const {viewType, renderData} = props;
    return (
      <div className={classNames('formatron-field', `formatron-field-${viewType.constructor.typeName}`)}>
        <Label>{viewType.getLabel(renderData)}</Label>
        <div className='formatron-field-wrapper'>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export const withStaticLabel = (WrappedComponent) => {
  return props => {
    const {viewType, renderData} = props;
    const ref = viewType.getRef && viewType.getRef();
    const {field} = ref ? {
      ...viewType.getFieldAndValue(renderData)
    } : {};

    const required = field && field.isRequired();

    return (
      <div className={classNames('formatron-static', `formatron-field-${viewType.constructor.typeName}`)}>
        <Label required={required}>
          {viewType.getLabel(renderData)}
        </Label>

        <WrappedComponent {...props} />
      </div>
    );
  };
};


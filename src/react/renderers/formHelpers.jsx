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
    const otherClasses = viewType.getFormClasses && viewType.getFormClasses();

    return (
      <label
        className={classNames('formatron-field', `formatron-field-${viewType.constructor.typeName}`, {
          'formatron-disabled': !!disabled,
          'formatron-error': !!error,
          ...otherClasses
        })}
      >
        <Label required={required}>
          {viewType.getLabel(renderData)}
        </Label>

        <div className='formatron-field-wrapper' data-error={error}>
          <WrappedComponent {...props} />
        </div>
      </label>
    );
  };
};

export const withSimpleLabel = (WrappedComponent) => {
  return props => {
    const {viewType, renderData} = props;
    const otherClasses = viewType.getFormClasses && viewType.getFormClasses();
    return (
      <div
        className={classNames(
          'formatron-field',
          `formatron-field-${viewType.constructor.typeName}`,
          otherClasses
        )}
      >
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
    const otherClasses = viewType.getFormClasses && viewType.getFormClasses();

    return (
      <div
        className={classNames(
          'formatron-static',
          `formatron-field-${viewType.constructor.typeName}`,
          otherClasses
        )}
      >
        <Label>
          {viewType.getLabel(renderData)}
        </Label>

        <WrappedComponent {...props} />
      </div>
    );
  };
};


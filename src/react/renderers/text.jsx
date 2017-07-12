import MaskedInput from 'react-maskedinput';

import TextType from '~/types/data/text';
import TextInputType from '~/types/view/data/text';

import {withDataRenderer, withDisplayRenderer} from './data';
import {withFormLabel, withStaticLabel} from './formHelpers';
import FormatronPropTypes from '~/react/propTypes';
import ReactRenderer from './reactRenderer';

const TextFilter = ({viewType, renderData}) => (
  <TextInputWrapper
    field={renderData.dataType}
    value={renderData.dataValue}
    onChange={renderData.options.onChange}
    onBlur={renderData.options.onBlur}
  />
);

const TextInputWrapper = props => {
  const wrappedProps = {
    ...props,
    onBlur: props.field.format ?
      () => {
        props.onChange(props.field.format(props.value));
        props.onBlur();
      } :
      props.onBlur
  };

  return (
    (props.field.getMask && props.field.getMask()) ?
      <FormatronMaskedInput {...wrappedProps} /> :
      (props.field.isMultiLined && props.field.isMultiLined()) ?
        <TextArea {...wrappedProps} /> :
        <TextInput {...wrappedProps} />
  );
};

TextInputWrapper.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(TextType),
  value: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

const FormatronMaskedInput = ({field, value, disabled, placeholder, onChange, onBlur}) => (
  <MaskedInput
    className='formatron-input formatron-text formatron-masked'
    mask={field.getMask()}
    disabled={!!disabled}
    value={value || ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

const TextInput = ({field, value, disabled, placeholder, onChange, onBlur}) => (
  <input
    className='formatron-input formatron-text'
    type={field.getType()}
    disabled={disabled}
    value={value || ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

const TextArea = ({field, value, disabled, placeholder, onChange, onBlur}) => (
  <textarea
    className='formatron-textarea formatron-text'
    disabled={disabled}
    value={value || ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />
);

const Text = withDataRenderer(props => (
  <TextInputWrapper {...props} />
));

const StaticText = withDisplayRenderer(({value}) => (
  <p className='formatron-static-value'>
    {value && value
      .split('\n')
      .map(line => (
        <span className='formatron-static-value-line'>
          {line}
        </span>
      ))
    }
  </p>
));

const TextField = withFormLabel(Text);
const StaticTextField = withStaticLabel(StaticText);

export default ReactRenderer.register(
  TextInputType,
  TextField,
  StaticTextField,
  TextFilter,
  Text,
  StaticText
);


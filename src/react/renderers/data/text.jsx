import MaskedInput from 'react-maskedinput';

import FormatronPropTypes from '~/react/propTypes';
import TextType from '~/types/data/text';
import TextInputType from '~/types/view/data/text';

import {withFormLabel, withStaticLabel} from '../formHelpers';
import ReactRenderer from '../reactRenderer';
import {withChangeOnBlurRenderer, withDisplayRenderer} from './';

const TextFilter = ({renderData}) => (
  <TextInputWrapper
    field={renderData.dataType}
    value={renderData.dataValue}
    onChange={renderData.options.onChange}
    onBlur={renderData.options.onBlur}
  />
);

const TextInputWrapper = props => {
  return props.field.getMask && props.field.getMask()
    ? <FormatronMaskedInput {...props} />
    : props.field.isMultiLined && props.field.isMultiLined()
      ? <TextArea {...props} />
      : <TextInput {...props} />;
};

TextInputWrapper.propTypes = {
  field: FormatronPropTypes.dataType.instanceOf(TextType),
  value: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired,
};

const FormatronMaskedInput = ({
  field,
  value,
  disabled,
  placeholder,
  onChange,
  onBlur,
}) =>
  <MaskedInput
    className="formatron-input formatron-text formatron-masked"
    mask={field.getMask()}
    disabled={!!disabled}
    value={value || ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />;

const TextInput = ({viewType, field, value, disabled, placeholder, onChange, onBlur}) =>
  <input
    className="formatron-input formatron-text"
    type={field.getType()}
    disabled={disabled}
    value={value || ''}
    placeholder={placeholder}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />;

const TextArea = ({field, value, disabled, placeholder, onChange, onBlur}) =>
  <div className='formatron-textarea-wrapper'>
    <textarea
      className="formatron-textarea formatron-text"
      disabled={disabled}
      value={value || ''}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      title={value}
    />
  </div>;

const Text = withChangeOnBlurRenderer(props => <TextInputWrapper {...props} />);

const StaticText = withDisplayRenderer(({value}) =>
  <p className="formatron-static-value">
    {value &&
      value.split('\n').map((line, i) =>
        <span key={i} className="formatron-static-value-line">
          {line}
        </span>
      )}
  </p>
);

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

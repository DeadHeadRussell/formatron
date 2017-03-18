import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import MaskedInput from 'react-maskedinput';

const phoneUtil = PhoneNumberUtil.getInstance();

export default function(register) {
  register('text', {
    component: TextComponent,
    validate: validateText,
    generateValue: generateTextValue,
    toString: textToString,
    getDefaultValue: getDefaultTextValue,
    hasValue: textHasValue
  });
}

const TextComponent = (props) => {
  switch (props.options.get('textType')) {
    case 'multiline':
      return <TextAreaComponent {...props} />;
    case 'ssn':
      return <SsnComponent {...props} />;
    case 'url':
      return <UrlComponent {...props} />;
    case 'tel':
    case 'singleline':
    case 'email':
    case 'password':
    case 'zipCode':
    default:
      return <TextInputComponent {...props} />;
  }
};

TextComponent.propTypes = {
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  options: ImmutablePropTypes.map.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func.isRequired
};

const TextAreaComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <textarea
    className='form-data-input textarea'
    name={name}
    disabled={disabled}
    value={value || ''}
    placeholder={options.get('placeholder')}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />;
};

const SsnComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <MaskedInput
    className='form-data-input masked'
    name={name}
    mask={'111-11-1111'}
    disabled={disabled}
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />;
};

const UrlComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  return <div>
    <input
      className='form-data-input url'
      name={name}
      type='url'
      disabled={disabled}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
    />
    <a className='form-data-input-action' href={value} _target='blank'>
      Open URL
    </a>
  </div>;
};

const TextInputComponent = ({name, value, options, disabled, onChange, onBlur}) => {
  const type = options.get('textType', 'text');

  return <input
    className='form-data-input text'
    name={name}
    type={type}
    disabled={disabled}
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
  />;
};

function textToString(value, options) {
  switch (options.get('textType')) {
    case 'password':
      return '********';
    case 'multiline':
      if (value && value.includes('\n')) {
        return `${value.split('\n')[0]}...`;
      }
      return value || '';
    case 'tel':
      try {
        const telno = phoneUtil.parse(value, 'US');
        return phoneUtil.format(telno, PhoneNumberFormat.NATIONAL);
      } catch(e) {}
      return value || '';
    case 'ssn':
    case 'url':
    case 'singleline':
    case 'email':
    case 'zipCode':
    default:
      return value || '';
  }
}

const regexps = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
  ssn: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
  zipCode: /^\d{5}([ \-]\d{4})?$/
};

function validateText(value, options) {
  if (value.length == 0) {
    if (options.get('required')) {
      throw new Error(validationErrors.required);
    }
    return;
  }

  const type = options.get('textType');
  switch (type) {
    case 'email':
    case 'url':
    case 'ssn':
    case 'zipCode':
      if (!regexps[type].test(value)) {
        throw new Error(validationErrors[type]);
      }
      return;

    case 'tel':
      const telno = phoneUtil.parse(value, 'US');
      if (!phoneUtil.isValidNumber(telno)) {
        throw new Error(validationErrors.tel);
      }
      return;

    case 'singleline':
    case 'password':
      if (value.includes('\n')) {
        throw new Error(validationErrors.singleline);
      }

    case 'multiline':
    default:
      return;
  }
}

// TODO: Move this functionality out of the library or somehow allow the user
// to customize this algorithm.
function generateTextValue() {
  function s4n(num) {
    return List()
      .set(num - 1, 0)
      .map(s4)
      .join('');
  }

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return List([2, 1, 1, 1, 3])
    .map(s4n)
    .join('-');
}

function getDefaultTextValue() {
  return '';
}

function textHasValue(value, options) {
  return value && value.length > 0;
}


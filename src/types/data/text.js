import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';

import DataType, {validationErrors} from './';
import ValidationError from './validationError';

const phoneUtil = PhoneNumberUtil.getInstance();

export default class TextType extends DataType {
  static typeName = 'text';

  static regexps = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
    ssn: /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/,
    zipCode: /^\d{5}([ \-]\d{4})?$/
  };

  getType() {
    return this.options.get('textType', 'raw');
  }

  isMultiLined() {
    return this.options.get('multi', false);
  }

  getMask() {
    return this.options.get('mask');
  }

  hasValue(value) {
    return !!(value && value.length > 0);
  }

  getDefaultValue() {
    super.getDefaultValue('');
  }

  format(value) {
    switch (this.getType()) {
      case 'tel':
        return this.getDisplay(value);

      default:
        return value || '';
    }
  }

  getDisplay(value) {
    switch (this.getType()) {
      case 'password':
        return '********';

      case 'tel':
        try {
          const telno = phoneUtil.parse(value, 'US');
          return phoneUtil.format(telno, PhoneNumberFormat.NATIONAL);
        } catch(e) {}
        return value || '';

      default:
        if (this.isMultiLined()) {
          if (value && value.includes('\n')) {
            return `${value.split('\n')[0]}...`;
          }
        }
        return value || '';
    }
  }

  validate(value) {
    return super.validate(value, () => {
      const type = this.getType();
      switch (type) {
        case 'email':
        case 'url':
        case 'ssn':
        case 'zipCode':
          if (!TextType.regexps[type].test(value)) {
            return new ValidationError(validationErrors[type], this);
          }
          return;

        case 'tel':
          try {
            const telno = phoneUtil.parse(value, 'US');
            if (!phoneUtil.isValidNumber(telno)) {
              return new ValidationError(validationErrors.tel, this);
            }
          } catch (e) {
            return new ValidationError(e.message, this);
          }
          return;

        case 'plain':
        case 'password':
        default:
          if (this.isMultiLined() && value.includes('\n')) {
            return new ValidationError(validationErrors.singleline, this);
          }
          return;
      }
    });
  }

  filter(filterValue, rowValue) {
    const filterString = `${filterValue}`.toLowerCase();
    const rowString = `${rowValue}`.toLowerCase();
    return rowString.indexOf(filterString) >= 0;
  }
}


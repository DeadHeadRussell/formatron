import ExtendableError from 'es6-error';
import {List} from 'immutable';

export default class ValidationError extends ExtendableError {
  constructor(message, field, value, ref) {
    super(message);
    this.field = field;
    this.value = value;
    this.ref = ref;
  }

  addRef(ref) {
    if (!this.ref) {
      this.ref = List([ref]);
    } else {
      this.ref = this.ref.unshift(ref);
    }
  }
}


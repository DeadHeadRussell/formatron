import classNames from 'classnames';
import Immutable, {List, Map, Set} from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Loading from '../loading';

import './index.sass';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.createInitialState();
  }

  createInitialState() {
    return {
      changes: Map(),
      blurs: Map(),
      dirty: Map(),
      errors: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.model && !newProps.model.equals(this.props.model)) {
      this.setState(this.createInitialState());
    }
  }

  isValid(model) {
    const validationErrors = this.props.schema.validate(model);

    if (validationErrors.size != 0) {
      console.error(validationErrors.toJS());
      this.setState({
        errors: validationErrors
      });

      this.setState({
        blurs: validationErrors
          .toMap()
          .mapEntries(([i, error]) => [error.ref, true])
      });
    } else {
      this.setState({errors: null});
    }

    return validationErrors.size == 0;
  }

  getChange = ref => {
    return this.state.change.get(ref);
  }

  getError = (model, ref) => {
    if (this.state.blurs.get(ref)) {
      const errors = this.props.schema.validateSingle(model, ref);
      return errors
        .filter(error => error.ref == ref)
        .map(error => error.value)
        .first();
    }
    return null;
  }

  isDisabled = ref => {
    return this.props.loading ||
      this.props.disabled === true ||
      (this.props.disabled && this.props.disabled.get(ref));
  }

  onClick = e => {
    // This is here so that the buttons on any date picker fields do not submit
    // the form when pressed.
    // TODO: This still fails when enter is pressed on the time field.
    this.clickTarget = e.target;
  }

  onSubmit = (model, e) => {
    e.preventDefault();

    if (!this.props.onSubmit) {
      return;
    }

    // See `onClick` method.
    const clicked = this.clickTarget;
    this.clickTarget = null;
    if (clicked && clicked.className.includes('date-picker')) {
      return;
    }

    if (this.isValid(model)) {
      this.props.onSubmit(model);
    }
  }

  onReset = e => {
    this.setState(this.createInitialState());
  }

  createRenderCallbacks(model) {
    return {
      onBlur: ref => {
        if (this.state.dirty.get(ref) || this.state.changes.get(ref)) {
          this.setState({blurs: this.state.blurs.set(ref, true)});
        }
      },

      onButtonClick: (...args) => {
        if (this.props.onButtonClick) {
          this.props.onButtonClick(...args);
        }
      },

      onChange: (ref, value) => {
        this.setState({
          changes: this.state.changes.set(ref, value),
          dirty: this.state.dirty.set(ref, true)
        });

        if (this.props.onChange) {
          this.props.onChange(this.props.schema.resolveChanges(
            model,
            Map().set(ref, value),
            Map(),
            Map()
          ));
        }
      }
    };
  }

  render() {
    const model = this.props.schema.resolveChanges(
      this.props.model,
      this.state.changes,
      this.props.defaultValue || Map(),
      this.props.disabled === true ?
        Map() :
        this.props.disabled || Map()
    );

    return this.props.simple ? (
      <div className={classNames(this.props.className)}>
        {this.renderInputs(model)}
      </div>
    ) : (
      <form
        className={classNames('form', this.props.className)}
        onClick={this.onClick}
        onKeyPress={this.onClick}
        onSubmit={this.onSubmit.bind(this, model)}
        onReset={this.onReset}
        noValidate='true'
      >
        {this.renderErrors()}
        {this.renderInputs(model)}
        {this.renderAction()}
      </form>
    );
  }

  renderErrors() {
    const errors = this.props.errors ?
      this.props.errors :
      this.props.error ?
        [this.props.error] :
        [];

    const validationErrors = this.state.errors || List();

    return (errors.length > 0 || validationErrors.size > 0) ? (
      <div className='form-errors'>
        {errors.map((error, i) => <p key={i} className='form-error'>{error.message}</p>)}
        {validationErrors.size > 0 ? (
          <div className='form-error container'>
            <p className='form-error-message'>The following fields have an error:</p>
            {validationErrors.map((validationError, i) => <p key={i} className='form-error-validation'>
              {List.isList(validationError.ref) ?
                validationError.ref.join(', ') :
                validationError.ref}
            </p>)}
          </div>
        ) : null}
      </div>
    ) : null;
  }

  renderInputs(model) {
    return this.props.schema
      .renderForm(model,
        {
          getChange: this.getChange,
          getError: this.getError.bind(this, model),
          getDisabled: this.isDisabled
        },
        this.createRenderCallbacks(model)
      )
  }

  renderAction() {
    return <div className={this.props.actionsClassName}>
      {this.props.loading ? (
        <Loading />
      ) : (
        this.props.actions
      )}
    </div>;
  }
}

Form.defaultProps = {
  model: Map()
};

Form.propTypes = {
  schema: React.PropTypes.object.isRequired,
  model: ImmutablePropTypes.map,

  defaultValue: ImmutablePropTypes.map,
  disabled: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    ImmutablePropTypes.map
  ]),
  loading: React.PropTypes.bool,

  onButtonClick: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,

  className: React.PropTypes.string,
  simple: React.PropTypes.bool,

  errors: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Error)),
  error: React.PropTypes.instanceOf(Error),

  actionsClassName: React.PropTypes.string,
  actions: React.PropTypes.arrayOf(React.PropTypes.element)
};

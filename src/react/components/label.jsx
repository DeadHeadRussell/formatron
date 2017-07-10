import classNames from 'classnames';

import FormatronPropTypes from '~/react/propTypes';

export default function Label({required, children}) {
  return children ? (
    <span className={classNames('formatron-label', {
      'formatron-required': required
    })}>
      {children}
    </span>
  ) : null;
}

Label.propTypes = {
  required: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ])
};


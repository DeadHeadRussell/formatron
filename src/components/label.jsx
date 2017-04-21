import React from 'react';

export default function Label({getters, required, children}) {
  return (children && getters.getSize() != 'small') ? (
    <span className='form-label-text'>
      {children} {required ? <span className='form-required'>*</span> : null}
    </span>
  ) : null;
}

Label.propTypes = {
  required: React.PropTypes.bool,
  children: React.PropTypes.node,
  getters: React.PropTypes.objectOf(React.PropTypes.func)
};


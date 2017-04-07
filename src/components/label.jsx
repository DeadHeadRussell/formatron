import React from 'react';

export default function Label({required, children}) {
  return children ? (
    <span className='form-label-text'>
      {children} {required ? <span className='form-required'>*</span> : null}
    </span>
  ) : null;
}

Label.propTypes = {
  required: React.PropTypes.bool,
  children: React.PropTypes.node
};


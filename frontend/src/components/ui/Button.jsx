import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ variant, children, ...props }) {
  const base = 'px-4 py-2 rounded font-semibold';
  const style =
    variant === 'default'
      ? `${base} bg-blue-600 text-white hover:bg-blue-700`
      : `${base} bg-gray-200 text-gray-800`;

  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['default', 'secondary']),
  children: PropTypes.node.isRequired,
};
Button.defaultProps = {
  variant: 'default',
};

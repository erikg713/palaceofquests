import React from 'react';
import PropTypes from 'prop-types';

export default function FadeOut({ children, duration = '4s', delay = '0s' }) {
  return (
    <div
      className="animate-fade"
      style={{
        animationDuration: duration,
        animationDelay: delay,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
}

FadeOut.propTypes = {
  children: PropTypes.node,
  duration: PropTypes.string,
  delay: PropTypes.string,
};

FadeOut.defaultProps = {
  children: null,
  duration: '4s',
  delay: '0s',
};

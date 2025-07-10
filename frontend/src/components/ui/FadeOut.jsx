import React from 'react';
export default function FadeOutBox() {
  return (
    <div className="w-64 h-32 bg-blue-500 text-white flex items-center justify-center animate-fade">
      This will fade out
    </div>
  );
}
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

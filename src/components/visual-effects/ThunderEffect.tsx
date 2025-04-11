import React from 'react';
import './effects.css';

const ThunderEffect: React.FC = () => {
  // Create multiple flash elements with staggered delays for a more natural effect
  const flashes = [
    { delay: `${Math.random() * 5 + 3}s`, duration: `${Math.random() * 0.2 + 0.1}s` }, // Longer delay, short flash
    { delay: `${Math.random() * 8 + 6}s`, duration: `${Math.random() * 0.3 + 0.15}s` }, // Even longer delay, slightly longer flash
    { delay: `${Math.random() * 4 + 2}s`, duration: `${Math.random() * 0.15 + 0.1}s` }, // Shorter delay cycle
  ];

  return (
    <div className="effect-container">
      {flashes.map((flash, i) => (
        <div
          key={i}
          className="lightning-flash"
          style={{
            animationDelay: flash.delay,
          }}
        />
      ))}
    </div>
  );
};

export default ThunderEffect;
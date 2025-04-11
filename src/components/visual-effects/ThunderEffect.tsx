// src/components/visual-effects/ThunderEffect.tsx
import React from 'react';
import './effects.css'; // Make sure this CSS file includes the @keyframes flash

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
            // Apply random delays and slightly varied durations per element
            animationDelay: flash.delay,
            // The base animation duration in CSS can be short (e.g., 0.5s)
            // controlling the visible part via keyframes.
            // Or, set the duration directly here (might override CSS if not careful)
            // animationDuration: flash.duration // Less common to vary duration this way for flashes
          }}
        />
      ))}
    </div>
  );
};

export default ThunderEffect;
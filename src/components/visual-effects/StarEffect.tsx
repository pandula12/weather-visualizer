import React from 'react';
import './effects.css';

interface StarEffectProps {
  count?: number;
}

const StarEffect: React.FC<StarEffectProps> = ({ count = 50 }) => {
  return (
    <div className="effect-container">
      {Array.from({ length: count }).map((_, i) => {
        // Randomize properties for each star
        const size = Math.random() * 1.5 + 0.5; // Size between 0.5px and 2px
        const top = Math.random() * 100; // Vertical position (%)
        const left = Math.random() * 100; // Horizontal position (%)
        const twinkleDuration = 1.5 + Math.random() * 1.5; // Twinkle duration 1.5s to 3s
        const twinkleDelay = Math.random() * 3; // Stagger twinkle start times

        return (
          <div
            key={i}
            className="star"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${top}%`,
              left: `${left}%`,
              animationDuration: `${twinkleDuration}s`,
              animationDelay: `${twinkleDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default StarEffect;
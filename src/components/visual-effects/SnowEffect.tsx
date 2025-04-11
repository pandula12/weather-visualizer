import React from 'react';
import './effects.css';

interface SnowEffectProps {
  intensity?: 'light' | 'moderate' | 'heavy';
  windSpeed?: number; // To influence horizontal drift
}

const SnowEffect: React.FC<SnowEffectProps> = ({ intensity = 'moderate'}) => {
  const count = intensity === 'heavy' ? 150 : intensity === 'moderate' ? 80 : 40;

  return (
    <div className="effect-container">
      {Array.from({ length: count }).map((_, i) => {
        // Randomize properties for each snowflake
        const size = Math.random() * 4 + 2; // Size between 2px and 6px
        const initialLeft = Math.random() * 100; // Initial horizontal position (%)
        const fallDuration = 8 + Math.random() * 7; // Fall duration between 8s and 15s
        const fallDelay = Math.random() * 10; // Start falling at different times
        const opacity = Math.random() * 0.6 + 0.4; // Opacity between 0.4 and 1.0

        return (
          <div
            key={i}
            className="snowflake"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${initialLeft}%`,
              opacity: opacity,
              animation: `snow-fall ${fallDuration}s linear ${fallDelay}s infinite`,
            }}
          />
        );
      })}
       {}
    </div>
  );
};

export default SnowEffect;
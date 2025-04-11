import React from 'react';
import './effects.css';

interface RainEffectProps { intensity?: 'light' | 'moderate' | 'heavy'; }

const RainEffect: React.FC<RainEffectProps> = ({ intensity = 'moderate' }) => {
  const count = intensity === 'heavy' ? 100 : intensity === 'moderate' ? 60 : 30;
  return (
    <div className="effect-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="raindrop"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`, // Vary speed
            animationDelay: `${Math.random() * 2}s`, // Stagger start times
            opacity: Math.random() * 0.5 + 0.3, // Vary opacity
          }}
        />
      ))}
    </div>
  );
};
export default RainEffect;
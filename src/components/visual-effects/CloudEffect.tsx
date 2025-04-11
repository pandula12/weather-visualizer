import React from 'react';
import './effects.css';

interface CloudEffectProps { count?: number; windSpeed?: number; }

const CloudEffect: React.FC<CloudEffectProps> = ({ count = 5, windSpeed = 2 }) => {
  const baseDuration = 60; // Base time to cross screen in seconds
  const duration = Math.max(baseDuration / (1 + windSpeed / 5), 20); // Faster with more wind, min 20s

  return (
    <div className="effect-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`cloud cloud-${(i % 3) + 1}`} // Use different cloud styles
          style={{
            top: `${10 + Math.random() * 40}%`, // Vary vertical position
            transform: `scale(${0.8 + Math.random() * 0.7})`, // Vary size
            animationDuration: `${duration * (0.8 + Math.random() * 0.4)}s`, // Vary speed slightly
            animationDelay: `${Math.random() * duration}s`, // Start at different points
          }}
        />
      ))}
    </div>
  );
};
export default CloudEffect;
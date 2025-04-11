// src/components/visual-effects/SnowEffect.tsx
import React from 'react';
import './effects.css'; // Ensure CSS is imported

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
              // Pass custom properties to CSS animation
              // We need unique animation names or handle drift differently if just using keyframes
              // Alternative: Use Framer Motion for easier dynamic animation based on props
              // Simpler CSS approach: Define drift within the keyframes maybe?
              // Let's try setting animation directly, might need adjustments
              animation: `snow-fall ${fallDuration}s linear ${fallDelay}s infinite`,
              // Add horizontal movement via a separate animation or modify snow-fall
              // For simplicity, let's assume snow-fall keyframes handle drift via CSS vars if possible,
              // or apply a simpler translateX here if keyframes are basic vertical fall.
              // --driftX: `${drift}px`, // Example if using CSS Vars in keyframes
            }}
            // Example of applying drift directly with another animation if needed:
            // style={{ ... above style properties ..., animation: `snow-fall ... , horizontal-drift ...` }}
          />
        );
      })}
       {/* Note: Directly controlling drift based on props purely in CSS animation keyframes
           without unique animation names per element or CSS vars can be tricky.
           The current implementation relies on the snow-fall keyframe possibly handling drift,
           or you might need a more advanced animation setup (like Framer Motion)
           for perfect prop-driven drift variance per snowflake.
           Let's define a basic vertical fall with slight sway in CSS for now.
       */}
    </div>
  );
};

export default SnowEffect;
// src/components/WeatherIcon.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, WiCloud, WiCloudy,
    WiShowers, WiRain, WiDayRain, WiNightAltRain, WiThunderstorm, WiSnow, WiFog, WiNa
} from 'react-icons/wi'; // Import more icons

interface WeatherIconProps {
  iconCode: string; // e.g., "01d", "04n"
  description: string; // e.g., "clear sky"
  size?: number;
  className?: string; // Allow passing custom classes
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconCode, description, size = 96, className = '' }) => {
    const isDay = iconCode.endsWith('d');
    const code = iconCode.substring(0, 2); // "01", "02", etc.

    let IconComponent: React.ElementType = WiNa; // Default icon
    let iconColor = "text-gray-500"; // Default color

    switch (code) {
        case '01': // Clear sky
            IconComponent = isDay ? WiDaySunny : WiNightClear;
            iconColor = "text-yellow-400";
            break;
        case '02': // Few clouds
            IconComponent = isDay ? WiDayCloudy : WiNightAltCloudy;
            iconColor = "text-gray-400";
            break;
        case '03': // Scattered clouds
             IconComponent = WiCloud;
             iconColor = "text-gray-500";
            break;
        case '04': // Broken clouds / Overcast clouds
            IconComponent = WiCloudy;
             iconColor = "text-gray-600";
            break;
        case '09': // Shower rain
            IconComponent = WiShowers;
            iconColor = "text-blue-400";
            break;
        case '10': // Rain
            IconComponent = isDay ? WiDayRain : WiNightAltRain;
            iconColor = "text-blue-500";
            break;
        case '11': // Thunderstorm
            IconComponent = WiThunderstorm;
            iconColor = "text-yellow-600";
            break;
        case '13': // Snow
            IconComponent = WiSnow;
            iconColor = "text-blue-200";
            break;
        case '50': // Mist, Fog etc.
            IconComponent = WiFog;
            iconColor = "text-gray-400";
            break;
        default:
             IconComponent = WiNa;
             iconColor = "text-gray-300";
            break;
    }

    // Simple animation
    const iconVariants = {
      hidden: { scale: 0.5, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 150, damping: 15 }
      },
    };

    return (
        <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            aria-label={`Weather condition: ${description}`}
        >
            <IconComponent size={size} className={`${iconColor} ${className}`} />
        </motion.div>
    );
};

export default WeatherIcon;
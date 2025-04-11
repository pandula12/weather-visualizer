// src/components/WeatherDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { WeatherData } from '@/types/weather';
import {
    WiBarometer, WiFog, WiHumidity, WiStrongWind, WiDirectionUp, WiCloud, WiThermometer, WiThermometerExterior
} from 'react-icons/wi';

interface WeatherDisplayProps {
    data: WeatherData;
    isDark: boolean; // To adapt styles based on background
}

// Animation variants
const containerVariants = { /* ... */ };
const itemVariants = { /* ... */ };
const paramsContainerVariants = { /* ... */ };

// Helper Function
const degreesToDirection = (degrees: number): string => { /* ... */ };

// --- Main Weather Display Component---
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, isDark }) => {
    const { main, weather, wind, name, sys, dt, visibility, clouds } = data;
    const weatherInfo = weather[0];

    return (
        <motion.div
            className="flex flex-col items-center justify-between w-full h-full px-4 py-6 md:py-8"
            variants={containerVariants} initial="hidden" animate="visible"
        >
            {/* Top Section: Location & Time */}
            <motion.div variants={itemVariants} className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">{name}, {sys.country}</h2>
                 <p className="text-sm opacity-80 mt-1">
                    {new Date(dt * 1000).toLocaleTimeString('en-AU', { weekday: 'long', hour: 'numeric', minute: '2-digit', timeZone: 'Australia/Darwin' })}
                 </p>
            </motion.div>

            {/* Middle Section: Core Weather Info */}
            <motion.div variants={itemVariants} className="flex flex-col items-center my-6 md:my-10">
                 <WeatherIcon iconCode={weatherInfo.icon} description={weatherInfo.description} size={140} className="drop-shadow-lg"/>
                <span className="text-7xl md:text-8xl font-extrabold mt-2 drop-shadow-md">{Math.round(main.temp)}°C</span>
                <p className="text-2xl md:text-3xl capitalize mt-1 opacity-90">{weatherInfo.description}</p>
                 <p className="text-lg mt-2 opacity-80">Feels like {Math.round(main.feels_like)}°C</p>
            </motion.div>

            {/* Bottom Section: Parameter Display */}
            <motion.div
                variants={paramsContainerVariants}
                className="flex flex-wrap justify-center items-stretch gap-3 md:gap-4 w-full mt-6"
            >
                 {/* Parameter items using updated SimpleParamDisplay */}
                 <motion.div variants={itemVariants}><SimpleParamDisplay label="WIND" value={`${wind.speed.toFixed(1)} m/s`} isDark={isDark} icon={<WiStrongWind size={28} />} /></motion.div>
                 <motion.div variants={itemVariants}><SimpleParamDisplay label="DIRECTION" value={`${degreesToDirection(wind.deg)} (${wind.deg}°)`} isDark={isDark} icon={<motion.div animate={{ rotate: wind.deg }}><WiDirectionUp size={28} /></motion.div>} /></motion.div>
                 <motion.div variants={itemVariants}><SimpleParamDisplay label="HUMIDITY" value={`${main.humidity}%`} isDark={isDark} icon={<WiHumidity size={28} />} /></motion.div>
                 <motion.div variants={itemVariants}><SimpleParamDisplay label="PRESSURE" value={`${main.pressure} hPa`} isDark={isDark} icon={<WiBarometer size={28} />} /></motion.div>
                 <motion.div variants={itemVariants}><SimpleParamDisplay label="VISIBILITY" value={`${(visibility / 1000).toFixed(1)} km`} isDark={isDark} icon={<WiFog size={28} />} /></motion.div>
                  {clouds && (<motion.div variants={itemVariants}><SimpleParamDisplay label="CLOUDINESS" value={`${clouds.all}%`} isDark={isDark} icon={<WiCloud size={28} />} /></motion.div>)}
            </motion.div>
        </motion.div>
    );
};


// --- Simple Parameter Display Sub-Component---
const SimpleParamDisplay: React.FC<{
    label: string; value: string | number; icon?: React.ReactNode; isDark: boolean;
}> = ({ label, value, icon, isDark }) => {

    // --- Revised Color Logic ---
    // Dark Theme (light text on dark background)
    const darkBgColor = 'bg-white/10';
    const darkLabelColor = 'text-slate-100';
    const darkValueColor = 'text-slate-100';
    const darkIconColor = 'text-sky-600';

    // Light Theme (dark text on light background)
    const lightBgColor = 'bg-white/40';
    const lightLabelColor = 'text-gray-700';
    const lightValueColor = 'text-black';
    const lightIconColor = 'text-blue-600';

    // Determine final classes based on isDark prop
    const bgColor = isDark ? darkBgColor : lightBgColor;
    const labelColor = isDark ? darkLabelColor : lightLabelColor;
    const valueColor = isDark ? darkValueColor : lightValueColor;
    const iconColor = isDark ? darkIconColor : lightIconColor;

    return (
        // Added backdrop-blur-md for a stronger frosted glass effect, especially on light mode
        <div className={`flex flex-col items-center text-center p-3 ${bgColor} rounded-lg backdrop-blur-md min-w-[90px] md:min-w-[100px] h-full justify-between shadow-sm border border-white/10`}> {/* Added subtle border */}
           <span className={`text-xs font-semibold ${labelColor} mb-1 uppercase tracking-wide`}>{label}</span>
           {icon && <div className={`my-1 ${iconColor} flex-grow flex items-center justify-center`}>{icon}</div>}
           <span className={`text-sm font-bold ${valueColor} mt-1`}>{value}</span>
       </div>
   );
};

export default WeatherDisplay;
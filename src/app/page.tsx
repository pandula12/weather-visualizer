// src/app/page.tsx
'use client';

// React and Hooks Imports
import React, { useState, useEffect, useCallback } from 'react';
// Animation Library Import
import { motion, AnimatePresence } from 'framer-motion';
// Icon Import for Tester Button
import { FiSliders } from 'react-icons/fi';

// Component Imports (ensure paths are correct in your project)
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import WeatherDisplay from '@/components/WeatherDisplay';

// Visual Effect Component Imports (ensure these components exist at the paths)
import RainEffect from '@/components/visual-effects/RainEffect';
import SnowEffect from '@/components/visual-effects/SnowEffect';
import CloudEffect from '@/components/visual-effects/CloudEffect';
import StarEffect from '@/components/visual-effects/StarEffect';
import ThunderEffect from '@/components/visual-effects/ThunderEffect';
// Sun effect components were removed based on previous feedback

// Type Definitions and Mock Data Imports (ensure paths are correct)
import { Coordinates, WeatherData } from '@/types/weather';
import { mockScenarios } from '@/lib/mockWeatherData';

// --- Background Styling Logic ---

// Interface to define the structure returned by getBackgroundStyle
interface BackgroundInfo {
    style: React.CSSProperties; // Contains the CSS background style
    isDark: boolean;            // Flag indicating if background is dark (requires light text)
}

// Function to determine the appropriate background style and text color requirements
const getBackgroundStyle = (weather: WeatherData | null): BackgroundInfo => {
    // Default style for loading or error states
    if (!weather) {
        // Default background is light blue, so indicate dark text is NOT needed (isDark: true means use light text)
        return { style: { background: 'linear-gradient(to br, #a1c4fd, #c2e9fb)' }, isDark: true };
    }

    // Extract relevant weather details
    const condition = weather.weather[0]?.main.toLowerCase();
    const description = weather.weather[0]?.description.toLowerCase();
    const iconCode = weather.weather[0]?.icon;
    const isDay = iconCode?.endsWith('d'); // Check if it's daytime based on OpenWeatherMap icon code

    // Define distinct color palettes for different weather conditions
    // darkText: true => background is light, requires dark text
    // darkText: false => background is dark, requires light text
    const palettes = {
        clear_day: { bg: 'radial-gradient(circle at 50% -10%, #fff1ad 0%, #ffe48a 15%, #87CEEB 45%, #2F80ED 100%)', darkText: false }, // Radial gradient for clear day
        clear_night: { bg: 'linear-gradient(to bottom, #0f172a, #1e293b, #334155)', darkText: false },
        few_clouds_day: { bg: 'linear-gradient(120deg, #90dff1 0%, #add3e6 50%, #bdc3c7 100%)', darkText: false },
        few_clouds_night: { bg: 'linear-gradient(to bottom, #1a2a40, #2c3e50, #465669)', darkText: false },
        scattered_clouds_day: { bg: 'linear-gradient(to bottom, #b0c4de, #c4d3e0, #d8e2ec)', darkText: true },
        scattered_clouds_night: { bg: 'linear-gradient(to bottom, #3e4a5e, #506078, #6b7a91)', darkText: false },
        broken_clouds_day: { bg: 'linear-gradient(to bottom, #adbacc, #becbd9, #d0d9e4)', darkText: true },
        broken_clouds_night: { bg: 'linear-gradient(to bottom, #34495e, #4b6580, #5e7996)', darkText: false },
        overcast_clouds_day: { bg: 'linear-gradient(to bottom, #adbacc, #becbd9, #d0d9e4)', darkText: true },
        overcast_clouds_night: { bg: 'linear-gradient(to bottom, #34495e, #4b6580, #5e7996)', darkText: false },
        shower_rain_day: { bg: 'linear-gradient(to bottom, #6a85b6, #8aacc8, #a9cfea)', darkText: false },
        shower_rain_night: { bg: 'linear-gradient(to bottom, #2c3e50, #3b526d, #4d698a)', darkText: false },
        rain_day: { bg: 'linear-gradient(to bottom, #5f7eab, #7d9bc3, #9bb8db)', darkText: false },
        rain_night: { bg: 'linear-gradient(to bottom, #283e51, #3a5572, #4b6d91)', darkText: false },
        thunderstorm_day: { bg: 'linear-gradient(to bottom, #4b5d7a, #3b4a61, #2c3a4a)', darkText: false },
        thunderstorm_night: { bg: 'linear-gradient(120deg, #16222a, #2c3e50 50%, #4a617a 100%)', darkText: false },
        snow_day: { bg: 'linear-gradient(to bottom, #e0e6f0, #f0f4fa, #ffffff)', darkText: true },
        snow_night: { bg: 'linear-gradient(to bottom, #ced7e0, #dde4ed, #e9eef5)', darkText: true },
        mist_day: { bg: 'linear-gradient(to bottom, #caced4, #dce0e6, #e8eaed)', darkText: true },
        mist_night: { bg: 'linear-gradient(to bottom, #8c9aab, #a7b3c1, #c1c8d1)', darkText: false },
        fog_day: { bg: 'linear-gradient(to bottom, #caced4, #dce0e6, #e8eaed)', darkText: true },
        fog_night: { bg: 'linear-gradient(to bottom, #8c9aab, #a7b3c1, #c1c8d1)', darkText: false },
    };

    // Determine the primary condition category for selecting the palette
    let primaryCondition = condition;
    if (condition?.includes('clouds')) {
        if (description?.includes('few clouds')) primaryCondition = 'few_clouds';
        else if (description?.includes('scattered clouds')) primaryCondition = 'scattered_clouds';
        else if (description?.includes('broken clouds')) primaryCondition = 'broken_clouds';
        else if (description?.includes('overcast clouds')) primaryCondition = 'overcast_clouds';
        else primaryCondition = 'clouds';
    } else if (condition?.includes('drizzle') || description?.includes('shower rain')) {
        primaryCondition = 'shower_rain';
    } else if (condition?.includes('rain')) {
        primaryCondition = 'rain';
    } else if (condition?.includes('thunderstorm')) {
        primaryCondition = 'thunderstorm';
    } else if (condition?.includes('snow')) {
        primaryCondition = 'snow';
    } else if (condition?.includes('mist') || condition?.includes('fog') || condition?.includes('haze') || condition?.includes('smoke') || condition?.includes('dust') || condition?.includes('sand') || condition?.includes('ash') || condition?.includes('squall') || condition?.includes('tornado')) {
        primaryCondition = 'mist';
    } else if (condition?.includes('clear')) {
        primaryCondition = 'clear';
    } else {
         primaryCondition = 'clear'; // Fallback
    }

    // Construct the final key (e.g., 'clear_day')
    const key = `${primaryCondition}_${isDay ? 'day' : 'night'}`;
    // Select the appropriate palette, providing a fallback
    const selectedPalette = palettes[key as keyof typeof palettes] || (isDay ? palettes.clear_day : palettes.clear_night);

    // Return the style object and the flag indicating if the background is dark
    return {
        style: { background: selectedPalette.bg },
        isDark: !selectedPalette.darkText, // isDark = true when light text is needed
    };
};

// --- WeatherEffects Component (Conditionally renders visual effects) ---
const WeatherEffects: React.FC<{ weather: WeatherData }> = ({ weather }) => {
    // Return null if no weather data is provided
    if (!weather) return null;

    // Extract necessary details
    const condition = weather.weather[0]?.main.toLowerCase();
    const description = weather.weather[0]?.description.toLowerCase();
    const iconCode = weather.weather[0]?.icon;
    const isDay = iconCode?.endsWith('d');
    const clouds = weather.clouds?.all || 0;
    const windSpeed = weather.wind?.speed || 0;

    // Conditionally render effect components based on weather conditions
    return (
        <>
            {/* Render Clouds if cloud percentage is significant */}
            {clouds > 10 && <CloudEffect count={Math.min(5 + Math.floor(clouds / 15), 15)} windSpeed={windSpeed} />}

            {/* Render Precipitation Effects */}
            {(condition === 'rain' || condition === 'drizzle') && <RainEffect intensity={description?.includes('heavy') ? 'heavy' : description?.includes('light') ? 'light' : 'moderate'} />}
            {condition === 'snow' && <SnowEffect intensity={description?.includes('heavy') ? 'heavy' : description?.includes('light') ? 'light' : 'moderate'} windSpeed={windSpeed} />}

            {/* Render Thunderstorm Effects */}
            {condition === 'thunderstorm' && <ThunderEffect />}

            {/* Render Star Effects for clear/few cloud nights */}
            {!isDay && (condition === 'clear' || description?.includes('few clouds')) && <StarEffect count={50} />}

            {/* Render simple overlay for atmospheric conditions like mist/fog */}
            {(condition === 'mist' || condition === 'fog' || condition === 'haze') &&
                <div className="absolute inset-0 bg-gray-400/10 backdrop-blur-[2px]"></div>
            }
        </>
    );
};


// --- Main Page Component Definition ---
export default function HomePage() {
    // --- State Definitions ---
    const [location, setLocation] = useState<Coordinates | null>(null); // User's geographic coordinates
    const [weather, setWeather] = useState<WeatherData | null>(null); // Weather data for user's location
    const [loadingLocation, setLoadingLocation] = useState(true); // Is location being fetched?
    const [loadingWeather, setLoadingWeather] = useState(false); // Is weather being fetched?
    const [error, setError] = useState<string | null>(null); // Any error messages
    const [mockWeatherData, setMockWeatherData] = useState<WeatherData | null>(null); // Selected mock scenario data
    const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo>(getBackgroundStyle(null)); // Current background style/theme
    const [showTester, setShowTester] = useState(false); // Visibility of the scenario tester dropdown
    // New state variable to track selected scenario
    const [selectedScenario, setSelectedScenario] = useState<string>('real');

    // --- Callback Function to Fetch Weather Data ---
    // Memoized using useCallback to prevent unnecessary re-creation
    const fetchWeatherForCoords = useCallback(async (coords: Coordinates) => {
        console.log("Fetching weather for coords:", coords);
        setLoadingWeather(true); // Set loading state
        setError(null);

        // Retrieve API key from environment variables
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
        if (!apiKey) {
             console.error("API Key is missing.");
             setError("Weather service configuration error. [API Key Missing]");
             setLoadingWeather(false);
             setWeather(null);
             return;
         }
        // Construct API URL
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`;

        // Fetch data and handle response/errors
        try {
             const response = await fetch(apiUrl);
             const data = await response.json();
             if (!response.ok) {
                 console.error("Weather API Error:", data);
                 throw new Error(data.message || `Weather service error (${response.status}).`);
             }
             console.log("Real weather data received:", data);
             setWeather(data as WeatherData); // Update state with fetched weather
             setError(null);
         } finally {
            setLoadingWeather(false); // Clear loading state
        }
    }, []); // Empty dependency array because it only uses env var


    // --- Callback Function to Get Location (and then Fetch Weather) ---
    // Memoized using useCallback
    const getLocationAndFetchWeather = useCallback(() => {
        console.log("Attempting location check and weather fetch...");
        setLoadingLocation(true); // Set loading state
        setError(null);
        // Don't reset location/weather here, let the logic decide

        // Check browser support for Geolocation
        if (!navigator.geolocation) {
             console.error("Geolocation API not supported.");
             setError('Geolocation not supported.');
             setLoadingLocation(false);
             return;
        }

        // Success callback for Geolocation API
        const handleSuccess = (position: GeolocationPosition) => {
            console.log("Location success:", position.coords);
            const newCoords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            setLoadingLocation(false); // Clear location loading state

            // Check if location state needs updating *before* fetching
            // Or if weather data is missing for the current location
            if (!location || location.latitude !== newCoords.latitude || location.longitude !== newCoords.longitude || !weather) {
                console.log("Location updated or weather missing, fetching weather...");
                setLocation(newCoords); // Update location state
                fetchWeatherForCoords(newCoords); // Fetch weather for these coordinates
            } else {
                // Location hasn't changed and we likely already have weather
                console.log("Location unchanged and weather likely present.");
                setLoadingWeather(false); // Ensure weather loading is off
            }
        };

        // Error callback for Geolocation API
        const handleError = (error: GeolocationPositionError) => {
            console.error("Location error:", error);
            let errorMessage = 'Failed to retrieve location.';
            // Provide user-friendly error messages based on error code
            switch (error.code) {
                 case error.PERMISSION_DENIED: errorMessage = "Location permission denied. Select a scenario or allow access."; break;
                 case error.POSITION_UNAVAILABLE: errorMessage = "Location information unavailable. Select a scenario."; break;
                 case error.TIMEOUT: errorMessage = "Getting location timed out. Select a scenario."; break;
                 default: errorMessage = `Unknown location error (Code: ${error.code}).`; break;
             }
            setError(errorMessage);
            // Reset states on location error
            setWeather(null);
            setLocation(null);
            setLoadingLocation(false);
            setLoadingWeather(false);
        };

        // Make the Geolocation API call
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: false, // Standard accuracy
            timeout: 10000,            // 10 second timeout
            maximumAge: 600000         // Allow cached location up to 10 minutes old
        });
    // Dependencies ensure function is updated if location state changes (relevant for the internal check)
    }, [fetchWeatherForCoords, location]); // Removed 'weather' dependency


    // --- Effect Hook for Initial Component Load ---
    useEffect(() => {
        // On component mount, set initial selected scenario and attempt to get location
        setSelectedScenario(mockWeatherData ? Object.keys(mockScenarios).find(
            k => mockScenarios[k].name === mockWeatherData.name
        ) || 'real' : 'real');
        
        if (!mockWeatherData) {
            getLocationAndFetchWeather();
        } else {
            // If mock data is set initially, bypass location/weather fetch
            setLoadingLocation(false);
            setLoadingWeather(false);
        }
        // Empty dependency array `[]` means this effect runs only once after the initial render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // --- Effect Hook to Update Background Style ---
    useEffect(() => {
       // Re-calculate and set background style whenever real or mock weather data changes
       setBackgroundInfo(getBackgroundStyle(mockWeatherData || weather));
    }, [weather, mockWeatherData]); // Dependencies trigger update when weather or mock data changes


    // --- Derived State for Rendering Logic ---
    const displayData = mockWeatherData || weather; // Prioritize showing mock data if selected
    // Determine appropriate text color class based on background brightness
    const textColorClass = backgroundInfo.isDark ? 'text-white' : 'text-gray-900';
    // Determine appropriate text shadow style
    const shadowStyle = backgroundInfo.isDark
        ? { textShadow: '1px 1px 3px rgba(0,0,0,0.4)' } // Dark shadow for light text
        : { textShadow: '1px 1px 3px rgba(255,255,255,0.3)' }; // Light shadow for dark text


    // --- Handler Function for Scenario Dropdown Change ---
    // Updated to use the dedicated state variable and handle "real" scenario properly
    const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const scenarioKey = e.target.value;
        console.log(`Scenario selected: ${scenarioKey}`); // Add explicit logging
        
        // Always update the selected scenario state
        setSelectedScenario(scenarioKey);
        setShowTester(false);

        if (scenarioKey === 'real') {
            console.log("--- HANDLING REAL SCENARIO SELECTION ---");
            setMockWeatherData(null);
            setError(null);
            
            if (location) {
                // We have location, just fetch weather
                setLoadingWeather(true);
                fetchWeatherForCoords(location);
            } else {
                // Need to get location first
                setLoadingLocation(true);
                setWeather(null);
                getLocationAndFetchWeather();
            }
        } else {
            console.log(`Switching to Mock Scenario: ${scenarioKey}`);
            setMockWeatherData(mockScenarios[scenarioKey]);
            setLoadingLocation(false);
            setLoadingWeather(false);
            setError(null);
        }
    };

    // --- Component Render JSX ---
    return (
        <motion.main
            // Apply dynamic classes and styles for background and text
            className={`flex min-h-screen flex-col items-center justify-center transition-colors duration-1000 ease-in-out relative overflow-hidden ${textColorClass}`}
            style={{ ...backgroundInfo.style, ...shadowStyle }}
            // Animate background changes
            animate={{ background: backgroundInfo.style.background }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            {/* --- Scenario Tester UI --- */}
            <div className="absolute top-3 left-3 z-50">
                 {/* Button to toggle the dropdown */}
                 <button
                    onClick={() => setShowTester(!showTester)}
                    // Adapt button style based on background brightness
                    className={`p-2 rounded-full shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        backgroundInfo.isDark
                        ? 'bg-white/20 hover:bg-white/30 text-white focus:ring-white' // Style for dark backgrounds
                        : 'bg-black/10 hover:bg-black/20 text-gray-800 focus:ring-gray-500' // Style for light backgrounds
                    }`}
                    aria-label="Select Weather Scenario"
                    title="Select Weather Scenario"
                 >
                    <FiSliders size={18} /> {/* Icon */}
                 </button>

                {/* Animated Dropdown Menu */}
                <AnimatePresence>
                    {showTester && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            // Styling for the dropdown container, adaptive to theme
                            className={`absolute top-full left-0 mt-2 p-3 rounded shadow-xl backdrop-blur-lg border ${
                                backgroundInfo.isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-300' // Increased opacity slightly
                            }`}
                         >
                            {/* Dropdown Label */}
                            <label htmlFor="weather-scenario" className={`block text-xs mb-1 font-medium ${
                                backgroundInfo.isDark ? 'text-gray-300' : 'text-gray-700' // Adapt label color
                            }`}>View Scenario:</label>
                            {/* The dropdown select element - UPDATED to use selectedScenario */}
                            <select
                                id="weather-scenario"
                                // Style the select element, adapting to background
                                className={`text-sm rounded p-1 border focus:outline-none focus:ring-1 ${
                                    backgroundInfo.isDark ? 'bg-gray-700 text-white border-gray-600 focus:ring-sky-300' : 'bg-white text-black border-gray-400 focus:ring-blue-500'
                                }`}
                                value={selectedScenario} // Use the dedicated state variable instead
                                onChange={handleScenarioChange} // Use the handler function on change
                            >
                                {/* Option to switch back to real-time weather */}
                                <option value="real">My Location</option>
                                {/* Populate options from imported mock data */}
                                {Object.keys(mockScenarios).map(key => (
                                    <option key={key} value={key}>{mockScenarios[key].name}</option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

             {/* --- Animated Weather Effects Layer --- */}
             {/* This div overlays the background and contains visual effects */}
             <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 {/* Render effects component only if there is data */}
                 {displayData && <WeatherEffects weather={displayData} />}
             </div>

             {/* --- Main Content Area (Displays Loading/Error/Weather) --- */}
             <div className="z-10 flex flex-col items-center justify-center w-full flex-grow p-4 md:p-6 mt-8">
                {/* Animate transitions between different states */}
                <AnimatePresence mode="wait">
                    {/* Loading Location State */}
                    {loadingLocation && !mockWeatherData && (
                        <motion.div key="loading-loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            {/* Pass isDark to LoadingSpinner for correct text/spinner color */}
                            <LoadingSpinner message="Getting your location..." isDark={backgroundInfo.isDark} />
                        </motion.div>
                    )}
                    {/* Error State (Show if error occurred, unless loading location again) */}
                    {error && (!loadingLocation || mockWeatherData) && (
                         <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md">
                            {/* ErrorMessage handles its own styling */}
                            <ErrorMessage message={error} />
                        </motion.div>
                    )}
                    {/* Loading Weather State (Show only when fetching real weather) */}
                    {loadingWeather && !error && !loadingLocation && !mockWeatherData && (
                         <motion.div key="loading-weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <LoadingSpinner message="Fetching weather..." isDark={backgroundInfo.isDark} />
                        </motion.div>
                    )}
                    {/* Display Weather Data State (Show if data is available and not loading/error, OR if mock is active) */}
                     {displayData && !error && (!loadingLocation || mockWeatherData) && (!loadingWeather || mockWeatherData) && (
                         <motion.div
                             // Unique key forces re-render/animation when data source changes
                             key={mockWeatherData ? mockWeatherData.name : (weather ? weather.dt : 'real-weather')} // Use timestamp if available for real weather key
                             className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                          >
                             {/* Render the WeatherDisplay component */}
                            <WeatherDisplay data={displayData} isDark={backgroundInfo.isDark} />
                         </motion.div>
                     )}
                    {/* Initial Waiting State (Only show if nothing else above applies) */}
                     {!loadingLocation && !loadingWeather && !displayData && !error && !location && !mockWeatherData && (
                         <motion.p
                            key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center" style={shadowStyle} // Apply text shadow for visibility
                         >
                            Please allow location access to see the weather.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

             {/* --- Footer --- */}
             <footer
                // Apply text shadow for visibility against dynamic backgrounds
                className={`z-20 w-full text-center p-2 text-xs opacity-70`} style={shadowStyle}
             >
                Weather data provided by OpenWeatherMap. App built by Pandula Gajadeera.
            </footer>
        </motion.main>
    );
}
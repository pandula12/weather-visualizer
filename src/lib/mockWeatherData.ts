import { WeatherData } from '@/types/weather';

// Helper function to generate timestamps relative to now for sys.sunrise/sunset
const getTimestamps = (isDay: boolean) => {
    const now = Date.now() / 1000; // Current time in seconds
    if (isDay) {
        return { sunrise: Math.floor(now - 4 * 3600), sunset: Math.floor(now + 4 * 3600), dt: Math.floor(now) }; // Assume mid-day
    } else {
        return { sunrise: Math.floor(now - 16 * 3600), sunset: Math.floor(now - 4 * 3600), dt: Math.floor(now) }; // Assume mid-night
    }
};

// Default structure to reduce repetition
const baseData = {
    coord: { lon: 0, lat: 0 }, base: "mock", id: 0, cod: 200, timezone: 0, name: "Simulated City", sys: { country: "XX", sunrise: 0, sunset: 0 }, dt: 0, visibility: 10000, clouds: { all: 0 },
};

export const mockScenarios: Record<string, WeatherData> = {
    clear_day: {
        ...baseData, ...getTimestamps(true), name: "Clear Day",
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        main: { temp: 25, feels_like: 24, temp_min: 20, temp_max: 28, pressure: 1015, humidity: 45 },
        wind: { speed: 3.1, deg: 120 }, clouds: { all: 5 },
    },
    clear_night: {
        ...baseData, ...getTimestamps(false), name: "Clear Night",
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }],
        main: { temp: 15, feels_like: 14, temp_min: 12, temp_max: 18, pressure: 1018, humidity: 60 },
        wind: { speed: 1.5, deg: 270 }, clouds: { all: 0 },
    },
    cloudy_day: {
        ...baseData, ...getTimestamps(true), name: "Cloudy Day",
        weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }],
        main: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20, pressure: 1012, humidity: 70 },
        wind: { speed: 4.0, deg: 90 }, clouds: { all: 75 },
    },
     few_clouds_day: {
        ...baseData, ...getTimestamps(true), name: "Few Clouds Day",
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
        main: { temp: 22, feels_like: 21, temp_min: 19, temp_max: 25, pressure: 1014, humidity: 55 },
        wind: { speed: 3.5, deg: 150 }, clouds: { all: 20 },
    },
    rain_day: {
        ...baseData, ...getTimestamps(true), name: "Rainy Day", visibility: 6000,
        weather: [{ id: 501, main: "Rain", description: "moderate rain", icon: "10d" }],
        main: { temp: 14, feels_like: 13, temp_min: 12, temp_max: 16, pressure: 1008, humidity: 85 },
        wind: { speed: 6.2, deg: 210 }, clouds: { all: 100 }, rain: { '1h': 2.5 }
    },
    snow_day: {
        ...baseData, ...getTimestamps(true), name: "Snowy Day", visibility: 2000,
        weather: [{ id: 601, main: "Snow", description: "snow", icon: "13d" }],
        main: { temp: -2, feels_like: -5, temp_min: -4, temp_max: 0, pressure: 1020, humidity: 90 },
        wind: { speed: 4.5, deg: 330 }, clouds: { all: 100 }, snow: { '1h': 1.0 }
    },
    thunder_day: {
        ...baseData, ...getTimestamps(true), name: "Thunderstorm", visibility: 4000,
        weather: [{ id: 211, main: "Thunderstorm", description: "thunderstorm", icon: "11d" }],
        main: { temp: 19, feels_like: 19, temp_min: 17, temp_max: 22, pressure: 1005, humidity: 80 },
        wind: { speed: 7.0, deg: 250 }, clouds: { all: 80 }, rain: { '1h': 5.0 } // Thunderstorms often have rain
    },
     mist_day: {
        ...baseData, ...getTimestamps(true), name: "Misty Day", visibility: 800,
        weather: [{ id: 701, main: "Mist", description: "mist", icon: "50d" }],
        main: { temp: 16, feels_like: 16, temp_min: 15, temp_max: 17, pressure: 1014, humidity: 95 },
        wind: { speed: 2.0, deg: 45 }, clouds: { all: 100 },
    },
};
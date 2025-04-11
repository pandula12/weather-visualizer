// src/types/weather.ts
export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
      id: number;
      main: string; // e.g., "Clouds"
      description: string; // e.g., "overcast clouds"
      icon: string; // e.g., "04d"
    }[];
    base: string;
    main: {
      temp: number; // Current temperature
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number; // Atmospheric pressure, hPa
      humidity: number; // Humidity, %
      sea_level?: number; // Atmospheric pressure on the sea level, hPa
      grnd_level?: number; // Atmospheric pressure on the ground level, hPa
    };
    visibility: number; // Visibility, meter. The maximum value of the visibility is 10km
    wind: {
      speed: number; // Wind speed. Unit Default: meter/sec
      deg: number; // Wind direction, degrees (meteorological)
      gust?: number; // Wind gust. Unit Default: meter/sec
    };
    clouds: {
      all: number; // Cloudiness, %
    };
    rain?: {
      '1h'?: number; // Rain volume for the last 1 hour, mm
      '3h'?: number; // Rain volume for the last 3 hours, mm
    };
    snow?: {
      '1h'?: number; // Snow volume for the last 1 hour, mm
      '3h'?: number; // Snow volume for the last 3 hours, mm
    };
    dt: number; // Time of data calculation, unix, UTC
    sys: {
      type?: number;
      id?: number;
      country: string; // Country code (GB, JP etc.)
      sunrise: number; // Sunrise time, unix, UTC
      sunset: number; // Sunset time, unix, UTC
    };
    timezone: number; // Shift in seconds from UTC
    id: number; // City ID
    name: string; // City name
    cod: number; // Internal parameter
  }
  
  // Add any other interfaces you might need
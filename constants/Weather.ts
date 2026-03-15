export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  is_day: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

// Fonctions Utilitaires

export function getWeatherInfos(code: number, isDay: number = 1): WeatherInfos {
  const currentColors = isDay ? colorSheet.day : colorSheet.night;

  switch (code) {
    case 0:
      return {
        label: "Ciel dégagé",
        imageSource: isDay
          ? require("@/assets/images/weather-icons/sunny 1.png")
          : require("@/assets/images/weather-icons/yellow-moon-with-clouds.png"),
        colors: currentColors,
      };
    case 1:
    case 2:
      return {
        label: code === 1 ? "Principalement dégagé" : "Partiellement nuageux",
        imageSource: isDay
          ? require("@/assets/images/weather-icons/cloudy-with-sun.png")
          : require("@/assets/images/weather-icons/yellow-moon-with-clouds.png"),
        colors: currentColors,
      };
    case 3:
      return {
        label: "Couvert",
        imageSource: require("@/assets/images/weather-icons/cloudy.png"),
        colors: currentColors,
      };
    case 45:
    case 48:
      return {
        label: "Brouillard",
        imageSource: require("@/assets/images/weather-icons/cloudy.png"),
        colors: currentColors,
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: code >= 56 ? "Bruine verglaçante" : "Bruine",
        imageSource: require("@/assets/images/weather-icons/umbrella-with-raindrops.png"),
        colors: currentColors,
      };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return {
        label: code >= 66 ? "Pluie verglaçante" : "Pluie",
        imageSource: require("@/assets/images/weather-icons/umbrella-with-raindrops.png"),
        colors: currentColors,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: code === 77 ? "Grains de neige" : "Neige",
        imageSource: require("@/assets/images/weather-icons/snowy.png"),
        colors: currentColors,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Averses",
        imageSource: require("@/assets/images/weather-icons/rain-showers-with-sun.png"),
        colors: currentColors,
      };
    case 85:
    case 86:
      return {
        label: "Averses de neige",
        imageSource: require("@/assets/images/weather-icons/clouds-with-snowflakes.png"),
        colors: currentColors,
      };
    case 95:
    case 96:
    case 99:
      return {
        label: code === 95 ? "Orage" : "Orage avec grêle",
        imageSource: require("@/assets/images/weather-icons/thunderstorm.png"),
        colors: currentColors,
      };
    default:
      return {
        label: "Inconnu",
        imageSource: require("@/assets/images/weather-icons/cloudy-with-sun.png"),
        colors: currentColors,
      };
  }
}

// Quelques strucutres utiles

export const colorSheet = {
  day: {
    background: "#2eb8e6",
    cardBackground: "rgba(67, 67, 67, 0.2)", // Couleurs des tuiles (cartes)
    cardBorder: "rgba(255, 255, 255, 0.2)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.8)",
    highlight: "rgba(255, 255, 255, 0.3)", // Elément sélectionné dans l'image
  },
  night: {
    background: "#0d2b7a",
    cardBackground: "rgba(0, 0, 0, 0.2)",
    cardBorder: "rgba(0, 0, 0, 0.3)",
    textPrimary: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    highlight: "rgba(0, 0, 0, 0.4)",
  },
};

export interface WeatherInfos {
  label: string;
  imageSource: any;
  colors: typeof colorSheet.day;
}

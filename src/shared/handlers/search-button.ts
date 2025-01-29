import { findData, locationInput } from "../datas/data";

interface LocationData {
  country: string;
  lat: number;
  localtime: string;
  localtime_epoch: number;
  lon: number;
  name: string;
  region: string;
  tz_id: string;
}

interface WeatherCondition {
  code: number;
  icon: string;
  text: string;
}

interface CurrentWeather {
  cloud: number;
  condition: WeatherCondition;
  dewpoint_c: number;
  dewpoint_f: number;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  heatindex_c: number;
  heatindex_f: number;
  humidity: number;
  is_day: number;
  last_updated: string;
  last_updated_epoch: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  wind_degree: number;
  wind_dir: string;
  wind_kph: number;
  wind_mph: number;
  windchill_c: number;
  windchill_f: number;
}

type PropsCurrentWeather = keyof CurrentWeather;

interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
}

const searchButton: HTMLButtonElement = document.querySelector(
  "#search-button"
)! as HTMLButtonElement;

const getDatasetWeather = (data: CurrentWeather) => {
  const elements = document.querySelectorAll<HTMLElement>("[data-weather]");
  const weatherElements: Partial<Record<PropsCurrentWeather, HTMLElement>> = {};

  Array.from(elements).forEach((element) => {
    const weatherKey = element.getAttribute("data-weather");
    if (weatherKey) {
      weatherElements[weatherKey as PropsCurrentWeather] = element;
    }
  });

  Object.entries(weatherElements).forEach(([key, value]) => {
    if (key in data) {
      value.textContent = `${data[key as keyof CurrentWeather]}`;
    }
  });

  console.log("Elements mappés:", weatherElements);
  return weatherElements;
};

searchButton?.addEventListener("click", async (_) => {
  const cityName = locationInput.value.trim();
  const weatherData: WeatherData = await findData(`${cityName}`);
  getDatasetWeather(weatherData.current);
});

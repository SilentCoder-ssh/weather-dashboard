import { findData, locationInput } from "../utils/find-data";

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

type WeatherData = CurrentWeather | DailyWeather

type PropsWeatherData = keyof CurrentWeather | keyof DailyWeather;

type WeatherForecast = {
  forecastday: {
    date: string;
    day: DailyWeather;
  }[];
};

interface WeatherCurrentData {
  location: LocationData;
  current: CurrentWeather;
  forecast: WeatherForecast;
}

interface DailyWeather {
  avghumidity: number;
  avgtemp_c: number;
  avgtemp_f: number;
  avgvis_km: number;
  avgvis_miles: number;
  condition: WeatherCondition;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
  daily_will_it_rain: number;
  daily_will_it_snow: number;
  maxtemp_c: number;
  maxtemp_f: number;
  maxwind_kph: number;
  maxwind_mph: number;
  mintemp_c: number;
  mintemp_f: number;
  totalprecip_in: number;
  totalprecip_mm: number;
  totalsnow_cm: number;
  uv: number;
}

const searchButton: HTMLButtonElement = document.querySelector(
  "#search-button"
)! as HTMLButtonElement;

const getDatasetWeather = (data: CurrentWeather | DailyWeather) => {
  const elements = document.querySelectorAll<HTMLElement>("[data-weather]");
  const weatherElements: Partial<Record<PropsWeatherData, HTMLElement>> = {};

  Array.from(elements).forEach((element) => {
    const weatherKey = element.getAttribute("data-weather");
    if (weatherKey) {
      weatherElements[weatherKey as PropsWeatherData] = element;
    }

    if (weatherKey === "condition.icon") {
      const iconElement = element as HTMLImageElement;
      if (data?.condition?.icon) {
        iconElement.src = data.condition.icon;
        iconElement.alt = "icon-condition";
      }
    }

    if (weatherKey === "condition.text") {
      const textElement = element as HTMLSpanElement;
      if (data?.condition?.text) {
        textElement.textContent = data.condition.text;
      }
    }

    if (weatherKey === "condition.code") {
      const codeElement = element as HTMLSpanElement;
      if (data?.condition?.code) {
        codeElement.textContent = String(data.condition.code);
      }
    }
  });

  Object.entries(weatherElements).forEach(([key, value]) => {
    if (key in data) {
      value.textContent = `${data[key as keyof WeatherData]}`;
    }
    // console.log("key :", key, "value :", value);
  });

  // console.log("Elements mappés:", weatherElements);
  return weatherElements;
};

searchButton?.addEventListener("click", async (_) => {
  const cityName = locationInput.value.trim();
  if(!cityName) return

  const weatherCurrentData: WeatherCurrentData = await findData(
    "current",
    `${cityName}`
  );
  getDatasetWeather(weatherCurrentData.current);
  console.log("current data : ", weatherCurrentData);

  const weatherDailyData = await findData("forecast", `${cityName}`);
  getDatasetWeather(weatherDailyData.forecast.forecastday[0].day);
  console.log("Daily data : ", weatherDailyData);
});

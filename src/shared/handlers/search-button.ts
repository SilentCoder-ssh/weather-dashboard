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

type WeatherData = CurrentWeather | DailyWeather | HourlyWeather;

type PropsWeatherData =
  | keyof CurrentWeather
  | keyof DailyWeather
  | keyof HourlyWeather;

type WeatherForecast = {
  forecastday: {
    date: string;
    day: DailyWeather;
    hourly: HourlyWeather[];
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

interface HourlyWeather {
  time: string;
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  is_day: number;
  chance_of_rain: number;
  chance_of_snow: number;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
  precip_mm: number;
  uv: number;
}

const searchButton: HTMLButtonElement = document.querySelector(
  "#search-button"
)! as HTMLButtonElement;

const svgLocation: SVGElement = document.querySelector(
  "#svg-location"
)! as SVGElement;

const tbody = document.querySelector(
  "#hourly-forecast-data"
)! as HTMLTableElement;

const getDatasetWeather = (data: WeatherData) => {
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
        iconElement.classList.add("w-8");
        iconElement.classList.add("h-8");
        iconElement.classList.add("ml-2");
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
  });
  return weatherElements;
};

const createTbodyHTML = (hourlyData: HourlyWeather[]) => {
  tbody.textContent = "";

  hourlyData.forEach((hour) => {
    const row = document.createElement("tr");
    row.id = "hourly-row";

    row.innerHTML = `
    <td class="time p-3 border border-gray-600 text-center">
        <span class="time-text font-semibold text-blue-300">${hour.time}</span>
    </td>
    <td class="temperature p-3 border border-gray-600 text-center">
        <span class="temp-c block text-lg text-white">${hour.temp_c}°C</span>
        <span class="temp-f text-sm text-gray-400">${hour.temp_f}°F</span>
    </td>
    <td class="condition p-3 border border-gray-600 flex items-center justify-center">
        <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="weather-icon w-8 h-8 mr-2">
        <span class="condition-text text-white">${hour.condition.text}</span>
    </td>
    <td class="precipitation p-3 border border-gray-600 text-center">
        <span class="chance-of-rain block text-blue-400">Rain: ${hour.chance_of_rain}%</span>
        <span class="chance-of-snow text-gray-400">Snow: ${hour.chance_of_snow}%</span>
    </td>
    <td class="wind p-3 border border-gray-600 text-center">
        <span class="wind-speed block text-white">${hour.wind_kph} km/h</span>
        <span class="wind-direction text-gray-400">${hour.wind_dir}</span>
    </td>
    <td class="humidity p-3 border border-gray-600 text-center">
        <span class="humidity-value text-blue-300 font-semibold">${hour.humidity}%</span>
    </td>
    <td class="feels-like p-3 border border-gray-600 text-center">
        <span class="feels-like-c block text-lg text-white">${hour.feelslike_c}°C</span>
        <span class="feels-like-f text-sm text-gray-400">${hour.feelslike_f}°F</span>
    </td>
    <td class="uv p-3 border border-gray-600 text-center">
        <span class="uv-index text-white font-semibold">${hour.precip_mm} mm</span>
    </td>
    <td class="uv p-3 border border-gray-600 text-center">
        <span class="uv-index text-white font-semibold">${hour.uv}</span>
    </td>
`;
    tbody.appendChild(row);
  });
};

searchButton?.addEventListener("click", async (_) => {
  try {
    const cityName = locationInput.value.trim();
    if (!cityName) {
      locationInput.classList.add("");
      return;
    }

    const weatherCurrentData: WeatherCurrentData = await findData(
      "current",
      `${cityName}`
    );
    getDatasetWeather(weatherCurrentData.current);
    console.log("current data : ", weatherCurrentData);

    const weatherDailyData = await findData("forecast", `${cityName}`);
    getDatasetWeather(weatherDailyData.forecast.forecastday[0].day);

    const weatherHourlyData = await findData("forecast", `${cityName}`);
    const hourlyData = weatherHourlyData.forecast.forecastday[0].hour;
    createTbodyHTML(hourlyData);

    svgLocation.classList.add("text-green-5");
    if (svgLocation.classList.contains("text-red-5")) {
      svgLocation.classList.replace("text-red-5", "title-green-5");
    }
  } catch (error) {
    console.error("Erreur de fetch des datas : ", error);
    svgLocation.classList.add("text-red-5");
  }
});

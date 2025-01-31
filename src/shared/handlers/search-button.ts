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
  const tbody = document.querySelector("#hourly-forecast-data")!;
  tbody.textContent = "";

  hourlyData.forEach((hour) => {
    const row = document.createElement("tr");
    row.id = "hourly-row";

    row.innerHTML = `
    <td class="time">
        <span class="time-text">${hour.time}</span>
      </td>
      <td class="temperature">
        <span class="temp-c">${hour.temp_c}°C</span>
        <span class="temp-f">${hour.temp_f}°F</span>
      </td>
      <td class="condition">
        <img src="${hour.condition.icon}" alt="${hour.condition.text}" class="weather-icon">
        <span class="condition-text">${hour.condition.text}</span>
      </td>
      <td class="precipitation">
        <span class="chance-of-rain">Rain: ${hour.chance_of_rain}%</span>
        <span class="chance-of-snow">Snow: ${hour.chance_of_snow}%</span>
      </td>
      <td class="wind">
        <span class="wind-speed">${hour.wind_kph} km/h</span>
        <span class="wind-direction">${hour.wind_dir}</span>
      </td>
      <td class="humidity">
        <span class="humidity-value">${hour.humidity}%</span>
      </td>
      <td class="feels-like">
        <span class="feels-like-c">${hour.feelslike_c}°C</span>
        <span class="feels-like-f">${hour.feelslike_f}°F</span>
      </td>
      <td class="uv">
        <span class="uv-index">${hour.uv}</span>
    </td>
  `;
    tbody.appendChild(row);
  });
};

searchButton?.addEventListener("click", async (_) => {
  try {
    const cityName = locationInput.value.trim();
    if (!cityName) return;

    const weatherCurrentData: WeatherCurrentData = await findData(
      "current",
      `${cityName}`
    );
    getDatasetWeather(weatherCurrentData.current);
    console.log("current data : ", weatherCurrentData);

    const weatherDailyData = await findData("forecast", `${cityName}`);
    getDatasetWeather(weatherDailyData.forecast.forecastday[0].day);
    console.log("Daily data : ", weatherDailyData);

    const weatherHourlyData = await findData("forecast", `${cityName}`);
    const hourlyData = weatherHourlyData.forecast.forecastday[0].hour;
    createTbodyHTML(hourlyData);
  } catch (error) {
    console.error("Erreur de fetch des datas : ", error);
  }
});

import { findData, locationInput } from "../datas/data";

const searchButton: HTMLButtonElement = document.querySelector(
  "#search-button"
)! as HTMLButtonElement;

const currentDateLastUpdated: HTMLSpanElement = document.querySelector(
  "#last-updated"
)! as HTMLSpanElement;

const currentCondition: HTMLSpanElement = document.querySelector(
  "#current-condition"
)! as HTMLSpanElement;

const currentIconCondition: HTMLImageElement = document.querySelector(
  "#icon-condition"
)! as HTMLImageElement;

const currentTemperature: HTMLSpanElement = document.querySelector(
  "#current-temperature"
)! as HTMLSpanElement;

const currentTemperatureFeel: HTMLSpanElement = document.querySelector(
  "#current-temperature-feel"
)! as HTMLSpanElement;

const currentWeatherCode: HTMLSpanElement = document.querySelector(
  "#current-weather-code"
)! as HTMLSpanElement;

const currentWeatherCloud: HTMLSpanElement = document.querySelector(
  "#current-weather-cloud"
)! as HTMLSpanElement;

const currentWeatherWind: HTMLSpanElement = document.querySelector(
  "#current-weather-wind"
)! as HTMLSpanElement;

const currentWeatherWindDir: HTMLSpanElement = document.querySelector(
  "#current-weather-wind-dir"
)! as HTMLSpanElement;

const currentWeatherWindDirDegree: HTMLSpanElement = document.querySelector(
  "#current-weather-wind-dir-degree"
)! as HTMLSpanElement;

const currentWeatherPrecipitation: HTMLSpanElement = document.querySelector(
  "#current-weather-precipitation"
)! as HTMLSpanElement;

if (!currentIconCondition.src)
  currentIconCondition.style.display = "none";


searchButton?.addEventListener("click", async (_) => {
  const cityName = locationInput.value.trim();
  const weatherData = await findData(`${cityName}`);

  currentDateLastUpdated.textContent = weatherData.current.last_updated;

  currentCondition.textContent = weatherData.current.condition.text;
  currentIconCondition.src = weatherData.current.condition.icon;
  currentIconCondition.alt = "icon-condition";
  currentTemperature.textContent = weatherData.current.temp_c;
  currentTemperatureFeel.textContent = weatherData.current.feelslike_c;
  currentWeatherCode.textContent = weatherData.current.condition.code;
  currentWeatherCloud.textContent = weatherData.current.cloud;
  currentWeatherWind.textContent = weatherData.current.wind_kph;
  currentWeatherWindDir.textContent = weatherData.current.wind_dir;
  currentWeatherWindDirDegree.textContent = weatherData.current.wind_degree;
  currentWeatherPrecipitation.textContent = weatherData.current.precip_mm;
});

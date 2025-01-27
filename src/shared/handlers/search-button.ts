import { findData, locationInput } from "../datas/data";
import { updateElement } from "../utils/update-elements";

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

if (!currentIconCondition.src) currentIconCondition.style.display = "none";

searchButton?.addEventListener("click", async (_) => {
  const cityName = locationInput.value.trim();
  const weatherData = await findData(`${cityName}`);

  updateElement(currentDateLastUpdated, weatherData?.current?.last_updated);
  updateElement(currentCondition, weatherData?.current?.condition?.text);
  updateElement(currentTemperature, weatherData?.current?.temp_c);
  updateElement(currentTemperatureFeel, weatherData?.current?.feelslike_c);
  updateElement(currentWeatherCode, weatherData?.current?.condition?.code);
  updateElement(currentWeatherCloud, weatherData?.current?.cloud);
  updateElement(currentWeatherWind, weatherData?.current?.wind_kph);
  updateElement(currentWeatherWindDir, weatherData?.current?.wind_dir);
  updateElement(currentWeatherWindDirDegree, weatherData?.current?.wind_degree);
  updateElement(currentWeatherPrecipitation, weatherData?.current?.precip_mm);

  if (weatherData?.current?.condition?.icon) {
    currentIconCondition.src = weatherData.current.condition.icon;
    currentIconCondition.alt = "icon-condition";
  }
});

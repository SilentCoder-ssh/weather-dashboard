import API_KEY from "../../hide/config";

const locationInput: HTMLInputElement = document.querySelector(
  "#location-input"
)! as HTMLInputElement;
const searchButton: HTMLButtonElement = document.querySelector(
  "#search-button"
)! as HTMLButtonElement;

const apiKey = API_KEY;

async function findData(cityName: string): Promise<any> {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;
 
  try {
    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    };
    
    const data = await response.json()
    console.log("Données reçues : ", data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
    throw error
  }
}

searchButton?.addEventListener("click", (_) => {
  const cityName = locationInput.value.trim();
  console.log('City name : ', cityName)
  findData(`${cityName}`);
});
const apiKey = import.meta.env.VITE_API_KEY;

export const locationInput: HTMLInputElement = document.querySelector(
  "#location-input"
)! as HTMLInputElement;

export async function findData(Time: string, cityName: string): Promise<any> {
  const racine = "https://api.weatherapi.com/v1";
  const url = `${racine}/${Time}.json?key=${apiKey}&lang=fr&q=${cityName}`;
  let data;

  try {
    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    data = await response.json();
    //console.log("Données reçues : ", data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données : ", error);
    throw error;
  }

  return data;
}

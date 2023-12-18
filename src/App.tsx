import { ChangeEvent, FormEvent, useState } from "react";
import "./App.css";
import { IWeather } from "./interfaces/IWeather";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IWeather>(Object);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = new URL(BASE_URL + "/current.json");
      url.searchParams.append("key", WEATHER_API_KEY);
      url.searchParams.append("q", query);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="query"
            id="query"
            value={query}
            onChange={handleChange}
            placeholder="City name or postal code..."
          />

          <input type="submit" value="SUBMIT" />
        </form>

        {Object.keys(results).length >= 1 ? (
          <div>
            <div>
              <label htmlFor="location">LOCATION:</label>
              <input
                type="text"
                name="location"
                id="location"
                value={`${results?.location?.name ?? ""}, ${
                  results?.location?.region ?? ""
                }, ${results?.location?.country ?? ""} `}
              />
            </div>

            <div>
              <label htmlFor="current">CURRENT:</label>
              <input
                type="text"
                name="current"
                id="current"
                value={`${results?.current?.temp_c + " °C" ?? ""}, ${
                  results?.current?.temp_f + " °F" ?? ""
                }`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default App;

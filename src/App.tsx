import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "./App.css";
import { IWeather } from "./interfaces/IWeather";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {

  const [unit, setUnit] = useState("°C");
  const [query, setQuery] = useState("La Sabana, San José, Costa Rica");
  const days = 3
  //const [days, setDays] = useState(3);
  
  const [results, setResults] = useState<IWeather>(Object);

  const handleChangeUnit = (e: ChangeEvent<HTMLSelectElement>) => setUnit(e.target.value);
  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  //const handleChangeDays = (e: ChangeEvent<HTMLInputElement>) => setDays(parseInt(e.target.value));

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = new URL(BASE_URL + "/forecast.json");
      url.searchParams.append("key", WEATHER_API_KEY);
      url.searchParams.append("q", query);
      url.searchParams.append("days", days.toString());
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect( () => {
    try {
      const simulateSubmit = async () => {
        try {
          const event = new Event("submit", { cancelable: true, bubbles: true });
          await handleSubmit(event as unknown as FormEvent);
        } catch (error) {
          console.error(error)
        }
      };
      
      simulateSubmit();
      
    } catch (error) {
      console.error(error)
    }
  }, [])

  return (
    <div className="main-container">
      <div className="header-container">
        <div className="app-name-container">
          <h1>WEATHER APP</h1>
        </div>
        <div className="unit-container">
          <label htmlFor="unit">Unit: </label>
          <select id="unit" value={unit} onChange={handleChangeUnit}>
            <option value="°C">°C</option>
            <option value="°F">°F</option>
          </select>
        </div>
      </div>

      <div className="weather-form-container">

        <form onSubmit={handleSubmit} className="weather-form">
          <div className="city-container">
            <label htmlFor="query">City name or postal code</label>
            <input
              type="text"
              name="query"
              id="query"
              value={query}
              required
              placeholder="City name or postal code..."
              autoComplete="off"
              onChange={handleChangeQuery}
              className="input-city"
              />
          </div>

          {/* <div className="">
            <label htmlFor="days">Number of days</label>
            <input
              type="number"
              name="days"
              id="days"
              value={days}
              min={1}
              max={3}
              required
              onChange={handleChangeDays}
              className="input-days"
              />
          </div> */}

          <div className="submit-container">
            <span></span>
            <input type="submit" value="SUBMIT" className="weather-submit-button"/>
          </div>
        </form>
      </div>

      {Object.keys(results).length >= 1 ? (
        <div className="results-container">

          <div className="location-container">

            <div>
              <label htmlFor="location">LOCATION</label>
              <h1>{`${results.location.name}, ${results.location.region}, ${results.location.country} `}</h1>
            </div>

            <div>
              <label htmlFor="current">CURRENT</label>
              <div className="current-temperature-container">
                <h1>{unit === "°C" ? results.current.temp_c : results.current.temp_f}</h1>
                <span>{unit}</span>
              </div>
            </div>

            <div>
              <label htmlFor="current">HUMIDITY</label>
              <div className="current-temperature-container">
                <h1>{results.current.humidity}</h1>
                <span>%</span>
              </div>
            </div>

            <div>
              <label htmlFor="current">WIND</label>
              <div className="current-temperature-container">
                <h1>{results.current.wind_kph}</h1>
                <span>KM/H</span>
              </div>
            </div>

            <div>
              <label htmlFor="current">LAST UPDATED</label>
              <div className="current-temperature-container">
                <h1>{results.current.last_updated.split(" ")[1]}</h1>
                <span></span>
              </div>
            </div>
            
          </div>


          <div className="forecast-heading-container">
            <h1 className="forecast-heading">Forecast for the next {days} days</h1>
          </div>


          <div className="forecast-container">
            {results?.forecast?.forecastday.map((day) => (
              <div key={day.date_epoch} className="forecast-card">
                <div className="day-container">
                  <h1>{day.date}</h1>
                  <div>
                    <p>{day.day.condition.text}</p>
                    <img src={day.day.condition.icon} alt="forecast-condition" />
                  </div>
                </div>
                <div className="temperature-container">
                  <div>
                    <h2>MIN</h2>
                    <div>
                      <span>{unit === "°C" ? day.day.mintemp_c : day.day.mintemp_f}</span>
                      <span>{unit}</span>
                    </div>
                  </div>
                  <div>
                    <h2>AVERAGE</h2>
                    <div>
                      <span>{unit === "°C" ? day.day.avgtemp_c : day.day.avgtemp_f}</span>
                      <span>{unit}</span>
                    </div>
                  </div>
                  <div>
                    <h2>MAX</h2>
                    <div>
                      <span>{unit === "°C" ? day.day.maxtemp_c : day.day.maxtemp_f}</span>
                      <span>{unit}</span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="waves-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#142850" fill-opacity="1" d="M0,192L13.3,186.7C26.7,181,53,171,80,154.7C106.7,139,133,117,160,90.7C186.7,64,213,32,240,53.3C266.7,75,293,149,320,165.3C346.7,181,373,139,400,128C426.7,117,453,139,480,122.7C506.7,107,533,53,560,64C586.7,75,613,149,640,170.7C666.7,192,693,160,720,149.3C746.7,139,773,149,800,165.3C826.7,181,853,203,880,181.3C906.7,160,933,96,960,101.3C986.7,107,1013,181,1040,208C1066.7,235,1093,213,1120,192C1146.7,171,1173,149,1200,133.3C1226.7,117,1253,107,1280,112C1306.7,117,1333,139,1360,144C1386.7,149,1413,139,1427,133.3L1440,128L1440,320L1426.7,320C1413.3,320,1387,320,1360,320C1333.3,320,1307,320,1280,320C1253.3,320,1227,320,1200,320C1173.3,320,1147,320,1120,320C1093.3,320,1067,320,1040,320C1013.3,320,987,320,960,320C933.3,320,907,320,880,320C853.3,320,827,320,800,320C773.3,320,747,320,720,320C693.3,320,667,320,640,320C613.3,320,587,320,560,320C533.3,320,507,320,480,320C453.3,320,427,320,400,320C373.3,320,347,320,320,320C293.3,320,267,320,240,320C213.3,320,187,320,160,320C133.3,320,107,320,80,320C53.3,320,27,320,13,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default App;

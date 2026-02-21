
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from './services/firebaseConfig';

import GithubProfile from './components/GithubProfile';
import LeafletMap from './components/LeafletMap'; 
import WeatherCard from './components/WeatherCard';
import './App.css';

const OPENWEATHER_TOKEN = 'a1d3f9176675f2f0f22056a2447d52ac'; 

function App() {
  const [githubUser, setGithubUser] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const [searchCity, setSearchCity] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const githubRes = await fetch(`https://api.github.com/users/${searchUsername}`);
      if (!githubRes.ok) throw new Error("Usuario de GitHub no encontrado");
      const githubJson = await githubRes.json();
      setGithubUser(githubJson);

      
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=es&format=json`);
      const geoJson = await geoRes.json();
      
      if (!geoJson.results || geoJson.results.length === 0) {
        throw new Error("Ciudad no encontrada");
      }
      
      const locData = {
        lat: geoJson.results[0].latitude,
        lng: geoJson.results[0].longitude,
        place_name: `${geoJson.results[0].name}, ${geoJson.results[0].country}`
      };
      setLocationData(locData);

      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locData.lat}&lon=${locData.lng}&appid=${OPENWEATHER_TOKEN}&units=metric&lang=es`);
      if (!weatherRes.ok) throw new Error("Error al obtener el clima");
      const weatherJson = await weatherRes.json();
      setWeatherData(weatherJson);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!githubUser || !locationData || !weatherData) {
      alert("Debes buscar un plan válido primero antes de guardar.");
      return;
    }

    

    try {

      console.log("1. Botón presionado. Intentando conectar a Firebase...");
      const planToSave = {
        user_id: githubUser.login,
        destination: locationData.place_name,
        coordinates: { lat: locationData.lat, lng: locationData.lng },
        weather_snapshot: {
          temp: weatherData.main.temp,
          condition: weatherData.weather[0].description
        },
        saved_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "travel_plans"), planToSave);
      alert(`¡Plan guardado con éxito! ID: ${docRef.id}`);

    } catch (err) {
      console.error("Error guardando en Firebase: ", err);
      alert("Hubo un error al guardar el plan.");
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Dev Travel Planner</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Usuario de GitHub"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ciudad a visitar"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Consultando APIs...' : 'Planear Viaje'}
          </button>
        </form>
        {error && <p className="error-msg" style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      </header>

      <main className="dashboard" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <div className="left-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GithubProfile userData={githubUser} />
          <WeatherCard weatherData={weatherData} />
        </div>
        <div className="right-column" style={{ flex: 2 }}>
          <LeafletMap locationData={locationData} />
        </div>
      </main>

      <footer className="footer" style={{ textAlign: 'center', padding: '20px' }}>
        <button onClick={handleSavePlan} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          💾 Guardar Plan en Firebase
        </button>
      </footer>
    </div>
  );
}

export default App;
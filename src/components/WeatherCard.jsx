
import React from 'react';

function WeatherCard({ weatherData }) {
    if (!weatherData) return <div className="placeholder">Esperando coordenadas para el clima...</div>;

    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    return (
        <div className="card weather-card">
            <h2>Clima Actual</h2>
            <div className="weather-info">
                <img src={iconUrl} alt="Icono del clima" />
                <div>
                    <h3>{weatherData.main.temp} °C</h3>
                    <p>Condición: {weatherData.weather[0].description}</p>
                    <p>Humedad: {weatherData.main.humidity}%</p>
                </div>
            </div>
        </div>
    );
}

export default WeatherCard; 

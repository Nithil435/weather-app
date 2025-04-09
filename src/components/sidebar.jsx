import React from "react";
import WeatherAlerts from "./WeatherAlerts";

const Sidebar = ({ city, setCity, fetchWeather, fetchWeatherByLocation, error, alerts }) => {
  return (
    <div className="sidebar">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={() => fetchWeather(city)}>Get Weather</button>
      <button onClick={fetchWeatherByLocation}>Auto Detect Location</button>
      {error && <p className="error">{error}</p>}

      {/* Weather Alerts Section */}
      <div className="weather-alerts-container">
        <h2>Weather Alerts</h2>
        <WeatherAlerts alerts={alerts} />
      </div>
    </div>
  );
};

export default Sidebar;

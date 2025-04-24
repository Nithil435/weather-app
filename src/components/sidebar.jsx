import React from "react";
import WeatherAlerts from "./WeatherAlerts";

const Sidebar = ({ city, setCity, fetchWeather, fetchWeatherByLocation, error, alerts }) => {
  const hasAlerts = alerts && alerts.length > 0;

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

      <div className={`weather-alerts-container${hasAlerts ? " show" : ""}`}>
        <h2>Weather Alerts</h2>
        {hasAlerts
          ? <WeatherAlerts alerts={alerts} />
          : <p>No active alerts.</p>
        }
      </div>
    </div>
  );
};

export default Sidebar;

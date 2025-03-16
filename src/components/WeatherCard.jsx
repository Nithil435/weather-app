import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHigh,
  faTint,
  faWind,
  faCompressAlt,
  faEye,
  faSun,
  faCloudSun,
  faCloudMoon,
} from "@fortawesome/free-solid-svg-icons";

const WeatherCard = ({ data, forecast, hourlyData }) => {
  if (!data || !forecast) {
    return <p>Loading weather data...</p>;
  }

  console.log("Hourly Data Received:", hourlyData); // Debugging log

  if (!hourlyData) {
    return <p>Hourly data not available.</p>; // Handle undefined hourly data
  }

  const { name, main, sys, wind, visibility, weather } = data;
  const airQualityIndex = forecast?.airQuality?.list?.[0]?.main?.aqi || "N/A";

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="weather-card">
      <h1>
        Weather in {name || "Unknown"}, {sys?.country || "N/A"}
      </h1>
      <div className="main weather">
  {main ? (
    <>
      <div className="weather-left">
        <div className="text">
          <span className="text-yellow-">&#9728;</span> {/* Sun icon */}
          {Math.round(main.temp)}°C
          <p className="text-small">
            Precipitation: 0% | Humidity: {main.humidity}% | Wind: {wind.speed} km/h
          </p>
        </div>
      </div>
      <div className="weather-right">
        <p className="text-xl font-semibold">Weather</p>
        <p className="text-gray-400">
          {new Date().toLocaleDateString("en-US", { weekday: "long" })},{" "}
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-gray-400">{weather?.[0]?.description || "N/A"}</p>
      </div>
    </>
  ) : (
    <p className="text-center">Loading...</p>
  )}
</div>

      <div className="weather-details">
        <div className="weather-box">
          <FontAwesomeIcon icon={faTemperatureHigh} size="2x" />
          <p>Temperature</p>
          <span>{main?.temp || "N/A"}°C</span>
        </div>
        <div className="weather-box">
          <FontAwesomeIcon icon={faTint} size="2x" />
          <p>Humidity</p>
          <span>{main?.humidity || "N/A"}%</span>
        </div>
        <div className="weather-box">
          <FontAwesomeIcon icon={faWind} size="2x" />
          <p>Wind Speed</p>
          <span>{wind?.speed || "N/A"} m/s</span>
        </div>
        <div className="weather-box">
          <FontAwesomeIcon icon={faCompressAlt} size="2x" />
          <p>Pressure</p>
          <span>{main?.pressure || "N/A"} hPa</span>
        </div>
      </div>

      <div className="weather-details2">
        <div className="weather">
          <FontAwesomeIcon icon={faEye} size="2x" />
          <p>Visibility</p>
          <span>{visibility ? visibility / 1000 : "N/A"} km</span>
        </div>
        <div className="weather">
          <FontAwesomeIcon icon={faSun} size="2x" />
          <p>Sunrise</p>
          <span>{sys?.sunrise ? formatTime(sys.sunrise) : "N/A"}</span>
        </div>
        <div className="weather">
          <FontAwesomeIcon icon={faCloudSun} size="2x" />
          <p>Sunset</p>
          <span>{sys?.sunset ? formatTime(sys.sunset) : "N/A"}</span>
        </div>
        <div className="weather">
          <FontAwesomeIcon icon={faCloudMoon} size="2x" />
          <p>Air Quality</p>
          <span>{airQualityIndex}</span>
        </div>
      </div>

      {/*5-Day Forecast */}
      <div className="forecast-section">
        <h3>5-Day Forecast</h3>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th>Wind Speed (m/s)</th>
              <th>Condition</th>
            </tr>
          </thead>
          <tbody>
            {forecast?.forecast?.map((day, index) => (
              <tr key={index}>
                <td>
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </td>
                <td>{day.temp}°C</td>
                <td>{day.humidity}%</td>
                <td>{day.wind_speed} m/s</td>
                <td>{day.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hourly Weather Component */}
      <HourlyWeather hourlyData={hourlyData} />
    </div>
  );
};

// Hourly Weather Component
const HourlyWeather = ({ hourlyData }) => {
  console.log("Received hourlyData:", hourlyData); // Debugging

  if (!Array.isArray(hourlyData) || hourlyData.length === 0) {
    return <p>No hourly data available</p>;
  }

  return (
    <div className="hourly-weather">
      <h2>Hourly Forecast</h2>
      <div className="hourly-scroll">
        {hourlyData.map((hour, index) => (
          <div key={index} className="hour-card">
            <p className="time">{hour.time}</p>
            <img
              src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
              alt={hour.description}
            />
            <p className="temp">{hour.temp}°C</p>
            <p className="desc">{hour.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;

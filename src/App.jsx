import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import Sidebar from "./components/sidebar";
import { useSearchParams } from "react-router-dom"; 
import "./index.css";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const App = () => {
  const [searchParams] = useSearchParams(); 
  const cityFromURL = searchParams.get("city");

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const showWeatherAlert = (message) => {
    const alertContainer = document.querySelector(".weather-alerts-container");

    if (alertContainer) {
      if (message) {
        alertContainer.textContent = message; // Set the alert text
        alertContainer.classList.add("show"); // Display it
      } else {
        alertContainer.classList.remove("show"); // Hide if no message
      }
    }
  };

  useEffect(() => {
    if (cityFromURL) {
      setCity(cityFromURL);
      fetchWeather(cityFromURL); // 👈 auto fetch
    }
  }, [cityFromURL]);

  const fetchWeather = async (customCity) => {
    const cityToSearch = customCity || city;
    //console.log("Weather API Key:", import.meta.env.VITE_WEATHER_API_KEY);
    setLoading(true);
    setError("");
    setWeatherData(null);
    setForecastData(null);
    setAlerts([]);
    setCity(cityToSearch);


    if (!cityToSearch.trim()) {
      setError("Please enter a valid city name.");
      setLoading(false);
      return;
    }

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(weatherResponse.data);

      const { lat, lon } = weatherResponse.data.coord;

      const airQualityResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityToSearch}&appid=${API_KEY}&units=metric`
      );

      const hourlyForecast = forecastResponse.data.list.slice(0, 6).map((entry) => ({
        time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: entry.main.temp,
        description: entry.weather[0].description,
        icon: entry.weather[0].icon,
      }));


  // Debugging logs
  //console.log("Full Forecast List:", forecastResponse.data.list);
  //console.log("Hourly Forecast Extracted:", hourlyForecast)

      // Fetch weather alerts
      const alertResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (alertResponse.data.alerts) {
        setAlerts(alertResponse.data.alerts);
      }
      
      
      const dailyForecast = {};
      forecastResponse.data.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
        if (!dailyForecast[date]) {
          dailyForecast[date] = { temp: [], humidity: [], wind: [], description: entry.weather[0].description };
        }
        dailyForecast[date].temp.push(entry.main.temp);
        dailyForecast[date].humidity.push(entry.main.humidity);
        dailyForecast[date].wind.push(entry.wind.speed);
      });

      const dailyForecastArray = Object.keys(dailyForecast).map((date) => {
        const dayData = dailyForecast[date];
        return {
          date,
          temp: (dayData.temp.reduce((a, b) => a + b, 0) / dayData.temp.length).toFixed(1),
          humidity: (dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length).toFixed(1),
          wind_speed: (dayData.wind.reduce((a, b) => a + b, 0) / dayData.wind.length).toFixed(1),
          description: dayData.description,
        };
      });

      setForecastData((prevData) => ({
        ...prevData,
        forecast: dailyForecastArray.slice(0, 5),
        airQuality: airQualityResponse.data,
        hourlyForecast: hourlyForecast,
        alerts: alerts.length > 0 ? alerts : null,
      }));
    } catch (err) {
      setError("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data by location (auto-detect)
  const fetchWeatherByLocation = () => {
   // console.log("Weather API Key:", import.meta.env.VITE_WEATHER_API_KEY);
    setLoading(true);
    setError("");
  
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          setWeatherData(weatherResponse.data);
          
  
          const airQualityResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
  
          const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
  
          const hourlyForecast = forecastResponse.data.list.slice(0, 6).map((entry) => ({
            time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            temp: entry.main.temp,
            description: entry.weather[0].description,
            icon: entry.weather[0].icon,
          }));
  
          // Fetch weather alerts
          const alertResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          if (alertResponse.data.alerts && alertResponse.data.alerts.length > 0) {
            setAlerts(alertResponse.data.alerts);
          } else {
            setAlerts([]);
          }
  
          const dailyForecast = {};
          forecastResponse.data.list.forEach((entry) => {
            const date = new Date(entry.dt * 1000).toISOString().split("T")[0];
            if (!dailyForecast[date]) {
              dailyForecast[date] = { temp: [], humidity: [], wind: [], description: entry.weather[0].description };
            }
            dailyForecast[date].temp.push(entry.main.temp);
            dailyForecast[date].humidity.push(entry.main.humidity);
            dailyForecast[date].wind.push(entry.wind.speed);
          });
  
          const dailyForecastArray = Object.keys(dailyForecast).map((date) => {
            const dayData = dailyForecast[date];
            return {
              date,
              temp: (dayData.temp.reduce((a, b) => a + b, 0) / dayData.temp.length).toFixed(1),
              humidity: (dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length).toFixed(1),
              wind_speed: (dayData.wind.reduce((a, b) => a + b, 0) / dayData.wind.length).toFixed(1),
              description: dayData.description,
            };
          });
  
          setForecastData({
            forecast: dailyForecastArray.slice(0, 5),
            airQuality: airQualityResponse.data,
            hourlyForecast: hourlyForecast,
            alerts: alerts.length > 0 ? alerts : null,
          });
        } catch (err) {
          console.error("Weather API Error:", err.response ? err.response.data : err);
          setError("Failed to fetch weather data.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);  
        alert(`Error Code: ${error.code}, Message: ${error.message}`);
        
        if (error.code === error.PERMISSION_DENIED) {
          setError("Location access denied by the user.");
        } else {
          setError("Unable to retrieve location.");
        }
        setLoading(false);
      }      
    );
  };
  
  return (
    <div className="title">
        <HelmetProvider>
        <title>Weather Forecast App | Live Weather by Nithil Varma</title>
        <meta
          name="description"
          content="Accurate and real-time weather forecasts with live alerts. Developed by Nithil Varma for quick weather insights by city or location."
        />
        <meta
          name="keywords"
          content="weather, forecast, live weather, temperature, city weather, weather alerts, weather app, Nithil Varma"
        />
        <meta name="author" content="Nithil Varma" />
        <link rel="canonical" href="https://weatherforecaste4.netlify.app/" />
        </HelmetProvider>
      <h1>Weather</h1>
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar cityToSearch={city} setCity={setCity} fetchWeather={fetchWeather} fetchWeatherByLocation={fetchWeatherByLocation} error={error} alerts={alerts}/>
      </div>
      <div className="main-container">
        {loading ? (
          <div className="loading">Loading weather data...</div>
        ) : weatherData && forecastData ? (
          <WeatherCard data={weatherData} forecast={forecastData} hourlyData={forecastData?.hourlyForecast} />

        ) : (
          <div className="no-data">
            <h2>Search for a city or use location to see the weather</h2>
          </div>
        )}
      </div>
    </div>
    <footer className="footer">
  <div className="footer-content">
    <p>© {new Date().getFullYear()} Weather Forecast App. All rights reserved.</p>
    <p>
      Developed by{' '}
      <a href="https://strong-gingersnap-96332e.netlify.app/" target="_blank" rel="noopener noreferrer">
        Nithil Varma
      </a>
    </p>
    <div className="footer-icons">
      <a href="https://github.com/Nithil435" target="_blank" rel="noopener noreferrer">
        <FaGithub size={20} />
      </a>
      <a href="https://www.linkedin.com/in/nithilvarma" target="_blank" rel="noopener noreferrer">
        <FaLinkedin size={20} />
      </a>
      <a href="mailto:nithilvarma435@gmail.com">
        <FaEnvelope size={20} />
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default App;

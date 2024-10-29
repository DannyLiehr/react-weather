import React, { useState, useEffect } from 'react';

import './App.css';

function App() {
  function getCardinalDirection(deg) {
  // Define ranges for each cardinal direction
  const directions = {
    "N": { min: 348.75, max: 359.9999 },
    "NE": { min: 0, max: 33.75 },
    "E": { min: 33.75, max: 56.25 },
    "SE": { min: 56.25, max: 78.75 },
    "S": { min: 78.75, max: 101.25 },
    "SW": { min: 101.25, max: 123.75 },
    "W": { min: 123.75, max: 146.25 },
    "NW": { min: 146.25, max: 348.75 },
  };

  // Loop through direction ranges
  for (const direction in directions) {
    const { min, max } = directions[direction];
    if (deg >= min && deg <= max) {
      return direction;
    }
  }

  return "Unknown";
}

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Options for accuracy and freshness
      );
      fetchWeather(location);
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []); // Empty dependency array [] ensures fetchWeather runs only once on mount
  
  

  const fetchWeather = async (location) => {
    // Implement your weather API call using location data and handle errors
    console.log(location)
    if (!location) {
      return document.querySelector("#error").innerHTML="Could not fetch location."
    }

    const { latitude, longitude } = location;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${import.meta.env.VITE_API_TOKEN}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const weatherData = await response.json();
       // Display the weather data
       document.querySelector("#weatherinf").style.display="block";
       document.querySelector("#loading").style.display="none";
       document.querySelector("#error").style.display="none";
       document.querySelector("#loc").innerHTML=weatherData.name;
       document.querySelector("#desc").innerHTML=weatherData.weather[0].description;
       // Temperatures
       document.querySelector("#temp").innerHTML=`${Math.round(weatherData.main.temp)}°F / ~${Math.round(((weatherData.main.temp) - 32) * 5/9)}°C`;
       document.querySelector("#feelslike").innerHTML=`${Math.round(weatherData.main.feels_like)}°F / ~${Math.round(((weatherData.main.feels_like) - 32) * 5/9)}°C`;
       document.querySelector("#high").innerHTML=`${Math.round(weatherData.main.temp_max)}°F / ~${Math.round(((weatherData.main.temp_max) - 32) * 5/9)}°C`;
       document.querySelector("#low").innerHTML=`${Math.round(weatherData.main.temp_min)}°F / ~${Math.round(((weatherData.main.temp_min) - 32) * 5/9)}°C`;
 
       // Icon
       document.querySelector("#weathericon").src=`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
       
       // Wind
       document.querySelector("#wind").innerHTML=`${getCardinalDirection(weatherData.wind.deg)} ${Math.round(weatherData.wind.speed)}MPH`;
       
       // Time
       document.querySelector("#sunrise").innerHTML=`${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
       document.querySelector("#sunset").innerHTML=`${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;

      // console.log(weatherData)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h1 id="loc">The Weather</h1>
        <img id="loading" src="https://cdn.pixabay.com/animation/2023/10/10/13/27/13-27-45-28_512.gif"/>
        <p id="error"></p>
        <div id="weatherinf">
          <h2 id="desc">Description</h2>
          <img id="weathericon" />
          <h3><span id="temp">0</span></h3>
          <h4>Feels Like <span id="feelslike">0</span></h4>
          <div id="highlowflex">
            <h4>High: <span id="high">0</span></h4>
            <h4>Low: <span id="low">0</span></h4>
          </div>
          
          <p>Wind: <span id="wind"></span></p>
          <hr/>
          <p>Sunrise: <span id="sunrise">0</span></p>
          <p>Sunset: <span id="sunset">0</span></p>
        </div>

      </div>
    </>
  );
}

export default App;

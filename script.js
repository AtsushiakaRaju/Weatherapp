async function fetchWeather() {
  let searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "cc87fff58852bcd845f108706f08e34a"; 

  if (searchInput === "") {
      weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
  }

  // Fetch coordinates (lat, lon) from city name
  try {
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geocodeURL);
      const geoData = await geoResponse.json();

      if (!geoData.length) {
          weatherDataSection.innerHTML = `
          <div>
            <h2>Invalid Input: "${searchInput}"</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
          </div>
          `;
          return;
      }

      const { lat, lon, name } = geoData[0];

      // Fetch weather data using coordinates
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const weatherResponse = await fetch(weatherURL);
      const weatherData = await weatherResponse.json();

      // Display weather data
      weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
      <div>
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp)}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
      </div>
      `;

      // Clear search input
      document.getElementById("search").value = "";

  } catch (error) {
      console.error("Error fetching weather data:", error);
      weatherDataSection.innerHTML = `
      <div>
        <h2>Error</h2>
        <p>Failed to fetch weather data. Please try again.</p>
      </div>
      `;
  }
}

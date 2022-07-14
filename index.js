var apiKey = "9066e9d0bae33df580e2d1dc52d963dd";
var searchForm = document.querySelector("#weather-app form");
var weatherEl = document.getElementById("weather");

async function getLatLon(query) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`
  );
  const body = await response.json();
  const latitude = body[0].lat;
  const longitude = body[0].lon;
  return {
    latitude: latitude,
    longitude: longitude,
  };
}

async function getWeatherData(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
  );
  const body = await response.json();
  return body;
}

function displayWeatherNotFound() {
  weatherEl.innerHTML = "";

  var h2 = document.createElement("h2");
  h2.innerText = "Location not found";
  weatherEl.appendChild(h2);
}

function displayWeather(weatherInfo) {
  weatherEl.innerHTML = "";

  var locationName = document.createElement("h2");
  locationName.innerText = `${weatherInfo.name}, ${weatherInfo.sys.country}`;
  weatherEl.appendChild(locationName);

  var viewMapLink = document.createElement("a");
  viewMapLink.href = `https://www.google.com/maps/search/?api=1&query=${weatherInfo.coord.lat},${weatherInfo.coord.lon}`;
  viewMapLink.setAttribute("target", "_BLANK");
  viewMapLink.innerText = "Click to view map";
  weatherEl.appendChild(viewMapLink);

  var weatherIcon = document.createElement("img");
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
  weatherEl.appendChild(weatherIcon);

  var weatherDescription = document.createElement("p");
  weatherDescription.style.textTransform = "capitalize";
  weatherDescription.innerText = weatherInfo.weather[0].description;
  weatherEl.appendChild(weatherDescription);

  weatherEl.appendChild(document.createElement("br"));

  var weatherCurrent = document.createElement("p");
  weatherCurrent.innerText = `Current: ${weatherInfo.main.temp}º F`;
  weatherEl.appendChild(weatherCurrent);

  var weatherFeelsLike = document.createElement("p");
  weatherFeelsLike.innerText = `Feels like: ${weatherInfo.main.feels_like}º F`;
  weatherEl.appendChild(weatherFeelsLike);

  weatherEl.appendChild(document.createElement("br"));

  var weatherLastUpdated = document.createElement("p");
  weatherLastUpdated.innerText = `Last updated: ${new Date(
    weatherInfo.dt * 1000
  ).toLocaleTimeString("en-US", {
    timeStyle: "short",
    timeZone: "America/New_York",
  })}`;
  weatherEl.appendChild(weatherLastUpdated);
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    var coords;
    try {
      coords = await getLatLon(searchForm.search.value);
    } catch (error) {
      coords = {};
    }
    var weatherInfo = await getWeatherData(coords.latitude, coords.longitude);
    console.log(weatherInfo);
    displayWeather(weatherInfo);
  } catch (error) {
    displayWeatherNotFound();
  }

  searchForm.search.value = "";
});

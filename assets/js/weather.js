// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather windget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
  unit: 'celsius',
};

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
  if (!CONFIG.trackLocation || !navigator.geolocation) {
    if (CONFIG.trackLocation) {
      console.error('Geolocation not available');
    }
    getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      getWeather(
        pos.coords.latitude.toFixed(3),
        pos.coords.longitude.toFixed(3)
      );
    },
    (err) => {
      console.error(err);
      getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
    }
  );
}

function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${CONFIG.language}&appid=${key}`;
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      let celsius = Math.floor(data.main.temp - KELVIN);
      weather.temperature.value =
        tempUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
    })
    .then(function () {
      displayWeather();
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value.toFixed(
    0
  )}°<span class="darkfg">${tempUnit}</span>`;
  descElement.innerHTML = weather.description;
}
function unitChange() {
  celsius = !celsius;
  displayTemperature(temperature);
  $(".tempUnit").toggleClass("d-none"); 
}

$(".changeUnit").click(unitChange);

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function positionResponseFunction(position){ 
    // Get weather data from openweathermap
    $.ajax({url: "https://api.openweathermap.org/data/2.5/weather",
           data: {
             lat: position.coords.latitude,
             lon: position.coords.longitude,
             APPID: "b64aa5a1d39a445bd242996a501979ed"
           }})
    .then(function weatherResponse(data) {
      console.log(data);
      temperature = data.main.temp;
      displayWeather(data);
      displayTemperature(data.main.temp)
    });
    
    //reverse geocode from google
    $.ajax({url: "https://maps.googleapis.com/maps/api/geocode/json",
           data: {
            latlng: `${position.coords.latitude},${position.coords.longitude}`,
            result_type: "locality|postal_code",
            key: "AIzaSyDzSfY7QJ7KD6q2mgkQ0gJxxWFN8U5Fh2E"
           }})
    .then(function reverseGeocodeResponse(data){
      console.log(data.results[0]);
      $("#location").text(data.results[0].formatted_address);
    })
  });

} else {
  console.log("geolocation not available.");
}
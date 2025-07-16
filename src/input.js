// Set variables for each element and Get id, class of elements
const cityInput = document.getElementById("city-input")
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_key = '98ea14f12b135c2969c8466e6f7d69b3'; //API key for OpenWeatherMap API
 
const createWeathercard = (cityName, weatherItem, index) => {
    if(index === 0){ // HTML for the main weather card
       return `
       <div class="details">
            <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
            <img src=" https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="clear" class="weather-icon">
            <h4>${weatherItem.weather[0].description}</h4>
       </div>
       `; 
    }else{ // HTML for the other 5 day forcast card
       return ` 
     <li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="clear" class="weather-icon">
                <h4>Temp: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>
    `; 
    }
    
}

const getWeatherDetalis = (cityName, lat, lon) => {
    const weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
    fetch(weather_API_URL).then(res => res.json()).then(data => {
        // console.log(data);
        //Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const next5daysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
    });
         
        //clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";


        // console.log(next5daysForecast);
        // creating weather cards and adding them to the DOM
        next5daysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeathercard(cityName, weatherItem, index));
  
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeathercard(cityName, weatherItem, index));

            }
            // createWeathercard(weatherItem);
        })
    }).catch(() => {
        alert('An error occurred while fetching the weather forecast!');
    });
} 


const getCityCoordinations = () =>{
    const cityName = cityInput.value.trim(); //Get user enteredd name and remove extra spaces
    if(!cityName) return; //  Return if cityName is empty 
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    
    //Get entered city coordinates (latitude, longitude, name) form API
    fetch(API_URL).then(res => res.json()).then(data => {
        // console.log(data)
        if(!data.length) return alert(`No coordinations found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetalis(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinations!")
    });
}  

const getuserCoordinations = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords; // Get coordinates of user location
            const location_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
            // Get city name from coordinates using reverse geocoding API
            fetch(location_URL).then(res => res.json()).then(data => {
                const {name} = data[0];
                getWeatherDetalis(name, latitude, longitude);
    }).catch(() => {
        alert("An error occurred while fetching the city!")
    });
        },
        error => { // Show alert if user denied the location permission
            if(error.code === error.PERMISSION_DENIED){
                alert("location request denied. Please reset location permission to grant access")
            }
        });
}


locationButton.addEventListener("click", getuserCoordinations);
searchButton.addEventListener("click", getCityCoordinations);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinations());
// Add event lister for search button if 'click Enter' then search city
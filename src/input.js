// for form section
const inputbox = document.getElementById('citybtn');
const cityButton = document.getElementById('citybutton');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
// for current weather info

const curr_city = document.getElementById('city');
const curr_temp = document.getElementById('temperature');
const curr_desc = document.getElementById('day1description');
const curr_humid = document.getElementById('humidity');
const curr_wind = document.getElementById('wind-speeed');
const curr_image = document.getElementById('curr-img');

async function checkWeather(city) {
    const apiKey = "98ea14f12b135c2969c8466e6f7d69b3";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
     
    const weather_data = await fetch(`${apiUrl}`).then
    (response => response.json());
    console.log(weather_data);
    
    curr_city.innerHTML = `${weather_data.sys.name}`
    curr_temp.innerHTML = `${weather_data.main.temp}°C`;
    curr_desc.innerHTML = `${weather_data.weather.description}`
    curr_humid.innerHTML = `${weather_data.main.humidity}%`;
    curr_wind.innerHTML = `${weather_data.wind.speed}km/h`;

    if(weather_data.cod === `404`){
        location_not_found.style.display = "flex";
        weather_body.style.display = "none" , weather_body.style.backgroundColor = "white";
        return;
    }
    location_not_found.style.display = "none";
    weather_body.style.display = "grid";

    switch (weather_data.curr_image.main){
        case 'cloud':
            curr_image.src = "/assets/cloud.jpg";
            break;
        case 'clear':
            curr_image.src = "/assets/cloud-icon";
            break;
        case 'snow':
            curr_image.src = "/assets/day snow cloud.png";
            break;
        case 'rain':
            curr_image.src = '/assets/bright-heavy-rain.webp';
            break;
    }    
}
cityButton.addEventListener('click', ()=>{
       checkWeather(inputbox.value);
})
    
    function openPopup() {
        document.getElementById("mapPopup").style.display = "flex";
        // Load the Google Map embed code into the mapContainer div
        // const embedCode = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15079.988770245666!2d73.03213625!3d19.1290963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1720506677115!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        document.getElementById("mapContainer").innerHTML = initMap();
    }

    function closePopup() {
        document.getElementById("mapPopup").style.display = "none";
        // Clear the map container when closing the popup
        document.getElementById("mapContainer").innerHTML = "";
    }

    document.getElementById("myLocationButton").addEventListener("click", openPopup);
  


   
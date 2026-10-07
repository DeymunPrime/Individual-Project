const cityForm = document.querySelector('#city-form');
const userCity = document.querySelector('#city');

cityForm.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const city = userCity.value.trim();
    if(city === ""){
        alert("Please enter a valid city name.");
        return;
    }
    
    try {
        const loc = await getCity(city);
        const weather = await getWeather(loc.lat, loc.lon);
        document.querySelector('#temp-range').textContent = `Temperature Range: ${weather.temperature_2m_min[0]}F - ${weather.temperature_2m_max[0]}F`;
        document.querySelector('#precipitation').textContent = `Precipitation: ${weather.precipitation_probability_max[0]}%`;
    } catch(error) {
        console.error("Error fetching weather data:", error);
        document.querySelector('#error').textContent = error.message;
    }
});

async function getCity(city) {
    const cityCords = await fetch (
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    ); 

    if(!cityCords.ok) {
        throw new Error("Network error for city.");
    }

    const cityData = await cityCords.json();
    const lat = cityData.results[0].latitude;
    const lon = cityData.results[0].longitude;

    console.log(cityData);
    return { lat, lon };
}

async function getWeather(lat, lon) {
    const weatherURL = await fetch (
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=GMT&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
    );
        
    if(!weatherURL.ok) {
        throw new Error("Network error for weather.");
    }

    const weatherData = await weatherURL.json();
    console.log(weatherData);
    return weatherData.daily;
}
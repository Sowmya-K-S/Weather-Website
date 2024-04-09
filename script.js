const searchButton = document.querySelector(".search-btn")
const locButton = document.querySelector(".location-btn")
const API_KEY = "42155015be76dfb166dd6ded1307375f";
const city_input = document.querySelector(".city-input")
const cardsdiv = document.querySelector(".cards")
const currentdiv = document.querySelector(".current")
const heading = document.querySelector(".Forecast-heading")
const createWeatherCard = (cityName, weatheritem, index) => {
    if(index === 0)
    {
        return `  <div class="details">
            <h2>${cityName} (${weatheritem.dt_txt.split(" ")[0]})</h2>
            <h4><i class="fa-solid fa-temperature-three-quarters"></i> Temperature: ${(weatheritem.main.temp -273.14).toFixed(2)}°C</h4>
            <h4><i class="fa-solid fa-wind"></i> Wind: ${weatheritem.wind.speed}m/s</h4>
            <h4><span class="mdi mdi-water-percent" ></span> Humidity: ${weatheritem.main.humidity}%</h4>
        </div>

        <div class="icon">
            <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@4x.png" alt="weather-icon">
            <h4>${weatheritem.weather[0].description}</h4>
        </div>`
    }
    else
    {
        return `<li class="card">
        <h3>${weatheritem.dt_txt.split(" ")[0]}</h3>
        <img src="https://openweathermap.org/img/wn/${weatheritem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4><i class="fa-solid fa-temperature-three-quarters"></i> Temp: ${(weatheritem.main.temp -273.14).toFixed(2)}°C</h4>
        <h4><i class="fa-solid fa-wind"></i> Wind:  ${weatheritem.wind.speed}  m/s</h4>
        <h4><span class="mdi mdi-water-percent" ></span>Humidity: ${weatheritem.main.humidity}%</h4>
    </li>`
    }

}
const getWeatherDetails = (cityName, lat, lon) =>
{
   const weatherApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
   
   fetch(weatherApi).then(res => res.json()).then(data => {
    
    //filter the forecasts to get only one forecast per day
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate()
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate)
        }
    })

    //clearing previous weather data
    city_input.value=""
    cardsdiv.innerHTML="" 
    currentdiv.innerHTML=""

    fiveDaysForecast.forEach((weatheritem, index) => {
        const html = createWeatherCard(cityName, weatheritem, index)
        if(index === 0)
        {
            currentdiv.insertAdjacentHTML("beforeend", html)
        }
        else
        {
            cardsdiv.insertAdjacentHTML("beforeend", html)
        }
        
    })

    heading.style.display = 'flex';

    

   }).catch(() => {
    alert("An error occured while fetching weather data")
})
}

const getCityCoordinates = () => 
{   

    name_of_city = city_input.value.trim() //Gets the user entered city name and removes extra spaces
    if(city_input === "")
        return

    const geoCodingApi =`http://api.openweathermap.org/geo/1.0/direct?q=${name_of_city}&limit=1&appid=${API_KEY}`

    // To fetch coordinates of entered city
    fetch(geoCodingApi).then(res => res.json()).then(data => {

        if(!data.length) return alert(`No coordinates found for ${name_of_city}`)  

        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);

    }).catch(() => {
        alert("An error occured while fetching the coordinates")
    })
}

const getUserCoordinates = () =>
{
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude} = position.coords
            const reverseGeocoding = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`

            fetch(reverseGeocoding).then(res => res.json()).then(data => {

                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
        
            }).catch(() => {
                alert("An error occured while fetching the city")
            })
        }
    )
}

searchButton.addEventListener('click',getCityCoordinates)
city_input.addEventListener('keyup', e => (e.key === "Enter" && getCityCoordinates()))
locButton.addEventListener('click',getUserCoordinates)




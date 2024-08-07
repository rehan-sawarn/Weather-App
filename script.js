const apiKey = "ead315a6b98ef39e0e1580aa1375f225";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".error").style.display = "block";
        document.querySelector(".forecast").style.display = "none";
        document.querySelector(".forecast-title").style.display = "none";
    } else {
        const data = await response.json();
        const forecast = await forecastResponse.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".feels-like").innerHTML = "Feels Like : " + Math.round(data.main.feels_like) + "°C";
        document.querySelector(".description").innerHTML = data.weather[0].main;
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        weatherIcon.src = getWeatherIconUrl(data.weather[0].icon);

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".forecast").style.display = "flex";
        document.querySelector(".forecast-title").style.display = "block";

        updateForecast(forecast);
    }
}

function getWeatherIconUrl(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function updateForecast(forecast) {
    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = "";

    const uniqueDays = new Set();
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!uniqueDays.has(day) && uniqueDays.size < 5) {
            uniqueDays.add(day);
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.innerHTML = `
                <p>${day}</p>
                <img src="${getWeatherIconUrl(item.weather[0].icon)}" alt="${item.weather[0].main}">
                <p>${Math.round(item.main.temp)}°C</p>
            `;
            forecastContainer.appendChild(dayElement);
        }
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data[0] && data[0].name) {
                            checkWeather(data[0].name);
                        }
                    })
                    .catch(error => console.error("Error fetching location name:", error));
            },
            error => {
                console.error("Error getting user location:", error);
                checkWeather("New York"); // Default city if geolocation fails
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        checkWeather("New York"); // Default city if geolocation is not supported
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

// Initialize with user's location or default city
getUserLocation();
const apiKey="ead315a6b98ef39e0e1580aa1375f225";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const forecastUrl="https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";

const searchBox=document.querySelector(".search input");
const searchBtn=document.querySelector(".search button");
const weatherIcon=document.querySelector(".weather-icon");

async function checkWeather(city){
    const response= await fetch(apiUrl+ city +`&appid=${apiKey}`);
    const forecastresponse= await fetch(forecastUrl+ city +`&appid=${apiKey}`);

    if (response.status==404) {
        document.querySelector(".weather").style.display="none";
        document.querySelector(".error").style.display="block";
    }
    else{
    var data= await response.json();
    var forecast= await forecastresponse.json() ;

    document.querySelector(".city").innerHTML=data.name;
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
    document.querySelector(".feels-like").innerHTML="Feels Like : "+Math.round(data.main.feels_like)+"°C";
    document.querySelector(".description").innerHTML=data.weather[0].main;
    document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
    document.querySelector(".wind").innerHTML=data.wind.speed+" km/h";

    if (data.weather[0].main=="Clear") {
        weatherIcon.src="images/clear.png";
    } else if (data.weather[0].main=="Clouds") {
        weatherIcon.src="images/clouds.png";
    } else if (data.weather[0].main=="Rain") {
        weatherIcon.src="images/rain.png";
    } else if (data.weather[0].main=="Snow") {
        weatherIcon.src="images/snow.png";
    } else if (data.weather[0].main=="Drizzle") {
        weatherIcon.src="images/drizzle.png";
    }
    document.querySelector(".weather").style.display="block";
    document.querySelector(".error").style.display="none";

    console.log(forecast);
    console.log(data);

    }
}

searchBtn.addEventListener("click",function(){
    checkWeather(searchBox.value);
});
"use strict";
export const __esModule = true;
//@ts-ignore
import moment from "./moment.js";
var timeEl = document.getElementById('time');
var dateEl = document.getElementById('date');
var timezoneEl = document.getElementById('time-zone');
var citynameEl = document.getElementById('cityname');
var currentEl = document.getElementById('current-weather');
var futureEl = document.getElementById('daily-forecast');
var coords = document.getElementById('coords');
var warn = document.querySelector(".warn");
var searchbar = document.querySelector("#search-bar");
var searchbutton = document.querySelector(".search button");
var defaultCity = "Ostrava";
var apikey = "ac6dc6a813165b3bb7ec47c7d5e874d8";
var days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
var months = ['Leden', 'Únor', 'Březen', 'Duben',
    'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen',
    'Listopad', 'Prosinec'];
setInterval(function () {
    var time = new Date();
    var month = time.getMonth();
    var date = time.getDate();
    var day = time.getDay();
    var hour = time.getTime();
    dateEl.innerHTML = days[day] + ', ' + date + '. ' + months[month];
    timeEl.innerHTML = moment(hour).format("HH:mm");
}, 1000);
getLocation();
searchByCity(defaultCity);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (succes) {
            var _a = succes.coords, latitude = _a.latitude, longitude = _a.longitude;
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" +
                latitude +
                "&lon=" + longitude +
                "&lang=cz&units=metric"
                + "&appid=" + apikey)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                showCurrentData(data);
                getWeatherData(latitude, longitude);
            });
        });
    }
    else {
        searchByCity(defaultCity);
    }
}
function showCurrentData(data) {
    var name = data.name;
    var _a = data.main, temp = _a.temp, feels_like = _a.feels_like, humidity = _a.humidity;
    var speed = data.wind.speed;
    var _b = data.weather[0], description = _b.description, icon = _b.icon;
    var _c = data.coord, lat = _c.lat, lon = _c.lon;
    getWeatherData(lat, lon);
    coords.innerHTML = "N:" + lat + " E:" + lon;
    citynameEl.innerHTML = name;
    currentEl.innerHTML = "<img src='http://openweathermap.org/img/wn/" + icon + "@4x.png' alt='weather icon' class='wicon'>"
        + "<div class='temp'>" + description + " " + temp.toFixed(1) + " &#176;C</div>"
        + "<div class='current-item'>"
        + "<div>Pocitová teplota</div>"
        + "<div> " + feels_like.toFixed(1) + "&#176;C</div>"
        + "</div>"
        + "<div class='current-item'>"
        + "<div>Vlhkost</div>"
        + "<div>" + humidity + "%</div> "
        + "</div>"
        + "<div class='current-item'>"
        + "<div>Rychlost větru</div>"
        + "<div>" + speed + " m/s</div>"
        + "</div>";
}
function searchByCity(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q="
        + city
        + "&units=metric&lang=cz&appid="
        + apikey)
        .then(function (response) {
        if (response.ok) {
            
        searchbar.value = "";
        warn.innerText = "";
        return response.json();
        }
        else {
            console.log("CHYBA VSTUPU");
            warn.innerText = "Chybné zadání";
        }
    })
        .then(function (data) {
        showCurrentData(data);
    });
}
function search() {
    searchByCity(searchbar.value);
}
searchbutton.addEventListener("click", function () {
    search();
});
searchbar.addEventListener("keyup", function (event) {
    if (event.key == "Enter")search();
});
function getWeatherData(lat, lon) {
    var otherDay = "";
    var idx = 0;
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" + lon +
        "&lang=cz&exclude=hourly,minutely&units=metric"
        + "&appid=" + apikey)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        //console.log(data);
        timezoneEl.innerHTML = data.timezone;
        data.daily.forEach(function (day, idx) {
            if (idx == 0) {
                //console.log(day);
            }
            else {
                // console.log(day);
                otherDay += "\n                    <div class=\"daily-forecast\" id=\"daily-forecast\">\n                        <div class=\"day\">".concat(moment(day.dt * 1000).format("dddd"), "</div>\n                        <img src=\"http://openweathermap.org/img/wn/").concat(day.weather[0].icon, ".png\" alt=\"weather icon\" class=\"w-icon\">\n                        <div class=\"temp\">Den ").concat(day.temp.day.toFixed(1), "&#176;C</div>\n                        <div class=\"temp\">Noc ").concat(day.temp.night.toFixed(1), "&#176;C</div>\n                    </div>");
            }
        });
        futureEl.innerHTML = otherDay;
    });
}

// apikeys for google and Ticket Master
const apiKeyG = "AIzaSyBiZYv6s5ocv7IYkiRQLleoe8MXRsMqtRc";
const apiKeyTM = "8gCIaWZY4lHT8Aj0NRXlEobIThAGmNGO";
var geolocationApiUrl = "http://ipwhois.app/json/";

// variables
const currentTimeDiv = document.getElementById("current-date-time");
const container = document.getElementById("container");
const mapDiv = document.getElementById("map");
const eventsListDiv = document.getElementById("events-list");
var userLatitude;
var userLongitude;
var userCity;

// current time and day
var today = moment();
currentTimeDiv.textContent = today.format("dddd, Do MMM, YYYY [at] h:mm a");

//find location of user's computer
fetch(geolocationApiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    userLatitude = data.latitude;
    userLongitude = data.longitude;
    userCity = data.city;
  });

// apikeys for google and Ticket Master
const apiKeyG = "AIzaSyBiZYv6s5ocv7IYkiRQLleoe8MXRsMqtRc";
const apiKeyTM = "8gCIaWZY4lHT8Aj0NRXlEobIThAGmNGO";
var geolocationApiUrl = "http://ipwhois.app/json/";

// variables
const currentTimeDiv = document.getElementById("current-date-time");
const container = document.getElementById("container");
const mapDiv = document.getElementById("map");
const eventsListDiv = document.getElementById("events-list");

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("keywords");

const searchHistory = document.getElementById("search-history")

var userInputArr = JSON.parse(localStorage.getItem("savedSearches")) || [];
var storageInput = JSON.parse(localStorage.getItem("savedSearches") || "[]");
var lastSearchedInput = storageInput.at(-1) || "Melbourne";
console.log("storageInput", storageInput);
console.log("lastSearchedInput", lastSearchedInput);


var userLatitude;
var userLongitude;
var userCity;

// current time and day
var today = moment();
currentTimeDiv.textContent = today.format("dddd, Do MMM, YYYY [at] h:mm a");

displayRecentSearches();


fetch(geolocationApiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);

    userLatitude = data.latitude;
    userLongitude = data.longitude;
    userCity = data.city;

    console.log(userLatitude);
    console.log(userLongitude);

    initMap(data)
  });



let map;

function initMap(data) {
  console.log("initMap passing:", data);
  console.log("userLatitude:", userLatitude);
  console.log("userLongitude:", userLongitude);
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: userLatitude, lng: userLongitude },
    zoom: 12,
  });
}

var city = "Melbourne"

var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city=" + city + "&apikey=" + apiKeyTM
function getApi() {

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      for (var i = 0; i < 5; i++) {
        var displayEl = document.createElement('p')
        eventsListDiv.append(displayEl)
        displayEl.innerHTML = "<strong>Name:</strong>" + (data._embedded.events[i].name) + '<br>'
        displayEl.innerHTML += "<strong>Address:</strong>" + JSON.stringify((data._embedded.events[i]._embedded.venues[0].address.line1)) + "<br>"
        //displayEl.innerHTML+=JSON.stringify((data._embedded.events[i]._embedded.venues[0].location))+"<br>"
        displayEl.innerHTML += "<strong>Date:</strong>" + (data._embedded.events[i].dates.start.localDate) + " <br>"
        displayEl.innerHTML += "<strong>Time:</strong>" + (data._embedded.events[i].dates.start.localTime) + "<br/>"

      }
    })
}

getApi()

// clearBtn

clearBtn.addEventListener("click", function () {
  userInputArr = [];
  localStorage.removeItem("savedSearches");
  searchHistory.innerText = "";

});

// searchBtn 
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  console.log(searchInput.value);

  if (searchInput.value === '' || !isNaN(searchInput.value)) {
    alert('Please Enter a city or a keyword.');
    return;
  } else if (searchInput.value) {
    saveRecentSearches();
    getApi(searchInput.value);
  }
  searchInput.value = "";

});

// saving resent searches in local storage
function saveRecentSearches() {
  var userSearchInput = searchInput.value;
  userInputArr.push(userSearchInput);
  localStorage.setItem("savedSearches", JSON.stringify(userInputArr));
  displayRecentSearches();

}

// displaying resent 5 searches in html (need to set css for btn class)
function displayRecentSearches() {
  searchHistory.innerHTML = "";
  const recentFiveSearch = userInputArr.slice(-5);
  recentFiveSearch.forEach(function (item) {
    const historyBtn = document.createElement("button");
    historyBtn.textContent = item;
    historyBtn.style.textTransform = "capitalize";
    historyBtn.setAttribute("class", "btn");
    searchHistory.appendChild(historyBtn);

    historyBtn.addEventListener("click", function (event) {
      console.log(event.target.textContent);
      const clickedCity = event.target.textContent;
      getApi(clickedCity);
    })

  })
}

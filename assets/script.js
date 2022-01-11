// apikeys for google and Ticket Master
const apiKeyG = "AIzaSyBiZYv6s5ocv7IYkiRQLleoe8MXRsMqtRc";
const apiKeyTM = "8gCIaWZY4lHT8Aj0NRXlEobIThAGmNGO";
var geolocationApiUrl = "http://ipwhois.app/json/";

// variables
const currentTimeDiv = document.getElementById("current-date-time");
const container = document.getElementById("container");
const mapDiv = document.getElementById("map");
const eventsListDiv = document.getElementById("events-list");

var myBtn = document.getElementById("searchBtn");

const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("keywords");

var searchHistory = document.getElementById("past_searches");

var userInputArr = JSON.parse(localStorage.getItem("savedSearches")) || [];
var storageInput = JSON.parse(localStorage.getItem("savedSearches") || "[]");
var lastSearchedInput = storageInput.at(-1) || "Melbourne";
console.log("storageInput", storageInput);
console.log("lastSearchedInput", lastSearchedInput);

var userLatitude;
var userLongitude;
var userCity;
var eventsList;
var lat;
var lon;
var position;

// current time and day
var today = moment();
currentTimeDiv.textContent = today.format("dddd, Do MMM, YYYY [at] h:mm a");

//displayRecentSearches();

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

    initMap(data);
  });

let map;
let service;
let infowindow;

function initMap(data) {
  console.log("initMap passing:", data);
  console.log("userLatitude:", userLatitude);
  console.log("userLongitude:", userLongitude);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: userLatitude, lng: userLongitude },
    zoom: 12,
  });
  const request = {
    query: localStorage.getItem("Location"),
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

// var city = "Melbourne"

// var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city=" + city + "&apikey=" + apiKeyTM
// function getApi() {

myBtn.addEventListener("click", function searchCity(event) {
  event.preventDefault();
  var city = document.getElementById("keywords").value;
  if (city === "" || !isNaN(city)) {
    alert("Please Enter a city or a keyword.");
    return;
  } else {
    localStorage.setItem("Location", city);
    initMap();
    getApi();
  }
});

myBtn.addEventListener("click", appendCities);

//retrieving events data and displaying them
function getApi() {
  var city = localStorage.getItem("Location");
  var queryURL =
    "https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city=" +
    city +
    "&apikey=" +
    apiKeyTM;

  fetch(queryURL)
    .then(function (response) {
      eventsList = [];
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      $("#events-list").html("<div></div>");
      if (data.page.totalElements == 0) {
        var displayEl = document.createElement("p");
        eventsListDiv.append(displayEl);
        displayEl.innerHTML = "No Events for this city";
      } else {
        for (var i = 0; i < 10; i++) {
          lat = Number(
            data._embedded.events[i]._embedded.venues[0].location.latitude
          );
          lon = Number(
            data._embedded.events[i]._embedded.venues[0].location.longitude
          );
          position = new google.maps.LatLng(lat, lon);
          eventsList.push(position);
          var displayEl = document.createElement("p");
          eventsListDiv.append(displayEl);
          displayEl.innerHTML =
            "<strong>Name:</strong>" + data._embedded.events[i].name + "<br/>";
          //displayEl.innerHTML+="<strong>Address:</strong>"+JSON.stringify((data._embedded.events[i]._embedded.venues[0].address.line1))+"<br>"
          displayEl.innerHTML+=JSON.stringify((data._embedded.events[i]._embedded.venues[0].location))+"<br>"
          displayEl.innerHTML +=
            "<strong>Date:</strong>" +
            data._embedded.events[i].dates.start.localDate +
            " <br/>";
          displayEl.innerHTML +=
            "<strong>Time:</strong>" +
            data._embedded.events[i].dates.start.localTime +
            "<br/>";
          console.log(lat);
          console.log(lon);
          console.log(position);
          console.log(eventsList);
        }
      }
    });
}

//append past searches and make them clickable
function appendCities(event) {
  event.preventDefault();
  var node = document.createElement("h1");
  node.setAttribute("id", "cityname");
  node.textContent = localStorage.getItem("Location");
  document.getElementById("past_searches").appendChild(node);

  node.addEventListener("click", function () {
    document.getElementById("keywords").value = "";
    var city = node.textContent;
    localStorage.setItem("Location", city);

    initMap();
    getApi();
  });
}

// for (var i = 0; i < 5; i++) {
//   var displayEl = document.createElement('p')
//   eventsListDiv.append(displayEl)
//   displayEl.innerHTML = "<strong>Name:</strong>" + (data._embedded.events[i].name) + '<br>'
//   displayEl.innerHTML += "<strong>Address:</strong>" + JSON.stringify((data._embedded.events[i]._embedded.venues[0].address.line1)) + "<br>"
//   //displayEl.innerHTML+=JSON.stringify((data._embedded.events[i]._embedded.venues[0].location))+"<br>"
//   displayEl.innerHTML += "<strong>Date:</strong>" + (data._embedded.events[i].dates.start.localDate) + " <br>"
//   displayEl.innerHTML += "<strong>Time:</strong>" + (data._embedded.events[i].dates.start.localTime) + "<br/>"

// }
//}

getApi();

// clearBtn

clearBtn.addEventListener("click", function () {
  userInputArr = [];
  localStorage.removeItem("Location");
  searchHistory.innerText = "";
  //searchHistory.removeChild(historyBtn);
  //$("past_searches").html('<div></div>');
});

// searchBtn
// searchBtn.addEventListener("click", function (event) {
//   event.preventDefault();
//   console.log(searchInput.value);

//   if (searchInput.value === '' || !isNaN(searchInput.value)) {
//     alert('Please Enter a city or a keyword.');
//     return;
//   } else if (searchInput.value) {
//     saveRecentSearches();
//     getApi(searchInput.value);
//   }
//   searchInput.value = "";

// });

// saving resent searches in local storage
// function saveRecentSearches() {
//   var userSearchInput = searchInput.value;
//   userInputArr.push(userSearchInput);
//   localStorage.setItem("savedSearches", JSON.stringify(userInputArr));
//   //displayRecentSearches();

//}

// displaying resent 5 searches in html (need to set css for btn class)
//function displayRecentSearches() {
//searchHistory.innerHTML = "";
//const recentFiveSearch = userInputArr.slice(-5);
// recentFiveSearch.forEach(function (item) {
//   const historyBtn = document.createElement("button");
//   historyBtn.textContent = item;
//   historyBtn.style.textTransform = "capitalize";
//   historyBtn.setAttribute("class", "btn");
//   searchHistory.appendChild(historyBtn);

//   // historyBtn.addEventListener("click", function (event) {
//   //   console.log(event.target.textContent);
//   //   const clickedCity = event.target.textContent;
//   //   getApi(clickedCity);
//   // })

// })
//}

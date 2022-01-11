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
var lat;
var lon;

// current time and day
var today = moment();
currentTimeDiv.textContent = today.format("dddd, Do MMM, YYYY [at] h:mm a");

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

function initMap(data) {
  console.log("initMap passing:", data);
  console.log("userLatitude:", userLatitude);
  console.log("userLongitude:", userLongitude);
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: userLatitude, lng: userLongitude },
    zoom: 12,
  });
}

var city = "Melbourne";

var queryURL =
  "https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city=" +
  city +
  "&apikey=" +
  apiKeyTM;
function getApi() {
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < 5; i++) {
        var displayEl = document.createElement("p");
        eventsListDiv.append(displayEl);
        displayEl.innerHTML =
          "<strong>Name:</strong>" + data._embedded.events[i].name + "<br>";
        displayEl.innerHTML +=
          "<strong>Address:</strong>" +
          JSON.stringify(
            data._embedded.events[i]._embedded.venues[0].address.line1
          ) +
          "<br>";
        //displayEl.innerHTML+=JSON.stringify((data._embedded.events[i]._embedded.venues[0].location))+"<br>"
        displayEl.innerHTML +=
          "<strong>Date:</strong>" +
          data._embedded.events[i].dates.start.localDate +
          " <br>";
        displayEl.innerHTML +=
          "<strong>Time:</strong>" +
          data._embedded.events[i].dates.start.localTime +
          "<br/>";

        lat = Number(
          data._embedded.events[i]._embedded.venues[0].location.latitude
        );
        console.log(lat);
        lon = Number(
          data._embedded.events[i]._embedded.venues[0].location.longitude
        );
        console.log(lon);

        displayEventMarker(lat,lon)

      }
      ;
    });}

  

  function displayEventMarker(lat,lon) {
    //function initMap() {
    console.log(lat + lon + "hi");
    //var event = { lat: lat, lng: lon };

    //var map = new google.maps.Map(document.getElementById("map"), {
     // zoom: 4,
     // center: new google.maps.LatLng(lat, lon),
    //});

      var eventMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lon),
        map: map,
      });
      //eventMarker.setMap(map);
    

    eventMarker.setMap(map);
  }
  //}
//}

getApi();

//display location markers

//function displayEventMarker(data) {
  //function initMap() {
 // console.log(data + "hi");
 // var event = { lat: lat, lng: lon };

 // var map = new google.maps.Map(document.getElementById("map"), {
   /* zoom: 4,
    center: event,
  });

  for (var i = 0; i < 5; i++) {
    var eventMarker = new google.maps.Marker({
      position: event,
      map: map,
    });
    //eventMarker.setMap(map);
  }

  eventMarker.setMap(map);
}
//}*/

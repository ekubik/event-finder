// apikeys for google and Ticket Master
const apiKeyG = "AIzaSyBiZYv6s5ocv7IYkiRQLleoe8MXRsMqtRc";
const apiKeyTM = "8gCIaWZY4lHT8Aj0NRXlEobIThAGmNGO";
var geolocationApiUrl = "http://ipwhois.app/json/";

// variables
const currentTimeDiv = document.getElementById("current-date-time");
const container = document.getElementById("container");
const mapDiv = document.getElementById("map");
const eventsListDiv = document.getElementById("events-list");
var myBtn=document.getElementById("searchBtn")
var userLatitude;
var userLongitude;
var userCity;

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

    initMap(data)
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




myBtn.addEventListener("click", function searchCity(event){ 
  event.preventDefault()
  var city=document.getElementById("keywords").value
  if (city === '' || !isNaN(city)) {
    alert('Please Enter a city or a keyword.');
    return;}
  else{
    localStorage.setItem("Location",city)
    initMap()
    getApi()}
  })

  myBtn.addEventListener("click",appendCities)
 
//retrieving events data and displaying them  
function getApi(){
 var city=localStorage.getItem("Location")
 var queryURL="https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city="+city+"&apikey="+apiKeyTM   
  fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
      console.log(data)
      $("#events-list").html('<div></div>'); 
      if(data.page.totalElements==0){var displayEl= document.createElement('p')
      eventsListDiv.append(displayEl)
     displayEl.innerHTML="No Events for this city"}
      else{ 
      for (var i=0;i<10;i++){
        var displayEl= document.createElement('p')
         eventsListDiv.append(displayEl)
        displayEl.innerHTML="<strong>Name:</strong>"+(data._embedded.events[i].name)+'<br/>'
        //displayEl.innerHTML+="<strong>Address:</strong>"+JSON.stringify((data._embedded.events[i]._embedded.venues[0].address.line1))+"<br>"
        //displayEl.innerHTML+=JSON.stringify((data._embedded.events[i]._embedded.venues[0].location))+"<br>"
        displayEl.innerHTML+="<strong>Date:</strong>"+(data._embedded.events[i].dates.start.localDate)+" <br/>"
        displayEl.innerHTML+="<strong>Time:</strong>"+(data._embedded.events[i].dates.start.localTime)+"<br/>"
      } 
    }
  })
}
 
 //append past searches and make them clickable
    function appendCities(event) {
      event.preventDefault()
      var node = document.createElement("h1");
      node.setAttribute("id","cityname")
      node.textContent=localStorage.getItem("Location");
      document.getElementById("past_searches").appendChild(node);
      
      node.addEventListener("click",function(){
      document.getElementById('keywords').value = ""
      var city=node.textContent 
      localStorage.setItem("Location",city) 
      initMap()
      getApi()
      })
    }
    
    
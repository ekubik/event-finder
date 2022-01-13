// apikeys for google and Ticket Master
const apiKeyG = "AIzaSyBiZYv6s5ocv7IYkiRQLleoe8MXRsMqtRc";
const apiKeyTM = "8gCIaWZY4lHT8Aj0NRXlEobIThAGmNGO";
//var geolocationApiUrl = "http://ipwhois.app/json/";

// variables
const currentTimeDiv = document.getElementById("current-date-time");
const container = document.getElementById("container");
const mapDiv = document.getElementById("map");
const eventsListDiv = document.getElementById("events-list");

const myBtn=document.getElementById("searchBtn")
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("keywords");
//var pastCities = [];
//const searchBtn = document.getElementById("searchBtn");
var searchHistory = document.getElementById("past_searches")
 var userInputArr = JSON.parse(localStorage.getItem("savedSearches")) || [];
 var storageInput = JSON.parse(localStorage.getItem("savedSearches") || "[]");
// var lastSearchedInput = storageInput.at(-1) || "Melbourne";
// console.log("storageInput", storageInput);
// console.log("lastSearchedInput", lastSearchedInput);

var userLatitude;
var userLongitude;
var userCity;

// current time and day
var today = moment();
currentTimeDiv.textContent = today.format("dddd, Do MMM, YYYY [at] h:mm a");

//displayRecentSearches();

// fetch(geolocationApiUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);

//     userLatitude = data.latitude;
//     userLongitude = data.longitude;
//     userCity = data.city;

//     console.log(userLatitude);
//     console.log(userLongitude);

//     initMap(data)
//   });

//retrieve user location

let map;
let service;
let infowindow;

function initMap() {
  //console.log("initMap passing:", data);
  //console.log("userLatitude:", userLatitude);
  //console.log("userLongitude:", userLongitude);
  infowindow = new google.maps.InfoWindow();
  
  //setting map on a default value
  map = new google.maps.Map(document.getElementById("map"), {
    center: {  lat: -37.8136, lng: 144.9631 },
    zoom: 12,
  });
  
  //setting marker for default position
  
  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          new google.maps.Marker({
            position: pos,
            map,
            title: "Current Location",
          });
          //infoWindow.setPosition(pos);
          //infoWindow.setContent("Location found.");
          //infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          //handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } //else {
      // Browser doesn't support Geolocation
     
     // handleLocationError(false, infoWindow, map.getCenter());
  //  }
  });
}

//function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  // alert("Access to location denied")
   //infoWindow.setPosition(pos);
  //infoWindow.setContent(
  //   browserHasGeolocation
  //     ? "Error: The Geolocation service failed."
  //     : "Error: Your browser doesn't support geolocation."
  // );
  // infoWindow.open(map);
//}
 
 
//}

 // const request = {
   // query: localStorage.getItem("Location"),
    //fields: ["name", "geometry"],
  //};
  
  //service = new google.maps.places.PlacesService(map);
  //service.findPlaceFromQuery(request, (results, status) => {
  // if (status === google.maps.places.PlacesServiceStatus.OK && results) {
     //for (let i = 0; i < results.length; i++) {
       // createMarker(results[i]);
     // }

      //map.setCenter(results[0].geometry.location);
    //}
  //});
//}


function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  // google.maps.event.addListener(marker, "click", () => {
  //   infowindow.setContent(place.name || "You are here!");
  //   infowindow.open(map);
  // });
}


// var city = "Melbourne"


// var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city=" + city + "&apikey=" + apiKeyTM
// function getApi() {



myBtn.addEventListener("click", function searchCity(event){ 
  event.preventDefault()
  var city=document.getElementById("keywords").value
  if (city === '' || !isNaN(city)) {
    alert('Please Enter a city or a keyword.');
    return;}
  else{
    localStorage.setItem("Location",city)
    //pastCities.push(city)
    //localStorage.setItem("past cities", JSON.stringify(pastCities))
    initMap()
    getApi()
  }
  })

myBtn.addEventListener("click",saveRecentSearches)
 
 
//retrieving events data and displaying them  
function getApi(){
  //new map with the location we insert
  function initMap1(data) {
    //console.log("initMap passing:", data);
    //console.log("userLatitude:", userLatitude);
    //console.log("userLongitude:", userLongitude);
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
  
var city=localStorage.getItem("Location")
var queryURL="https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&city="+city+"&apikey="+apiKeyTM   

initMap1()
 
fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)

  $("#events-list").html('<div></div>'); 
//checking if there are events on the user city  
  if(data.page.totalElements==0){
    var displayEl= document.createElement('p')
    eventsListDiv.append(displayEl)
    displayEl.innerHTML="No Events for this city"
  }
  else{ 
      for (var i=0;i<10;i++){
        var displayEl= document.createElement('p')
        eventsListDiv.append(displayEl)
        displayEl.innerHTML="<strong>Name:</strong>"+(data._embedded.events[i].name)+'<br/>'
        //displayEl.innerHTML+="<strong>Address:</strong>"+JSON.stringify((data._embedded.events[i]._embedded.venues[0].address.line1))+"<br>"
        //displayEl.innerHTML+=JSON.parse((data._embedded.events[i]._embedded.venues[0].location.latitude))+"<br>"
        //displayEl.innerHTML+=JSON.parse((data._embedded.events[i]._embedded.venues[0].location.longitude))+"<br>"
        displayEl.innerHTML+="<strong>Date:</strong>"+(data._embedded.events[i].dates.start.localDate)+" <br/>"
        displayEl.innerHTML+="<strong>Time:</strong>"+(data._embedded.events[i].dates.start.localTime)+"<br/>"
        
      //putting markers on every event  
        var location = { lat: JSON.parse((data._embedded.events[i]._embedded.venues[0].location.latitude)), lng: JSON.parse((data._embedded.events[i]._embedded.venues[0].location.longitude)) };
        addMarker(location,map)
      
      } 
    }
  })
}    

function addMarker(location, map) {
    var marker = new google.maps.Marker({
      position: location,
      title:"",
      map:map
      });
}
 
//append past searches and make them clickable
function appendCities(event) {
      event.preventDefault()
      
      for (var i = 0; i < "past cities".length; i++){
        var node = document.createElement("h1");
        node.textContent=(localStorage.getItem("past cities".key(i)));
        document.getElementById("past_searches").appendChild(node);
       
        node.addEventListener("click",function(){
          document.getElementById('keywords').value = ""
          var city=node.textContent 
          localStorage.setItem("Location",city) 
         
      
      
      
      //var node = document.createElement("h1");
      
      //node.setAttribute("id","cityname")
      //node.textContent=localStorage.getItem("Location");
      //document.getElementById("past_searches").appendChild(node);
      
      //node.addEventListener("click",function(){
      //document.getElementById('keywords').value = ""
      //var city=node.textContent 
      //localStorage.setItem("Location",city) 
     
      
      //citiesToShow=pastCities.splice(-5)
// console.log(citiesToShow)
// for(var i=0;i<citiesToShow.length;i++){
//     var x=document.createElement("p")
//     x.textContent=citiesToShow[i]
//     mydiv.append(x)
// }
      initMap()
      getApi()
      })
}}
    
    

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




// var pastCities = [];
// var mydiv=document.querySelector("#past_searches")

// function myFunction(){
//   //alert("ciao")  

//   pastCities[0] = "rome";
//   pastCities[1]="milan"
// //console.log(names)
// pastCities.push("vienna")
// pastCities.push("berlin")
// pastCities.push("prague")
// pastCities.push ("madrid")
// pastCities.push ("barcelona")
// pastCities.push ("munchen")
// pastCities.push("london")
// console.log(pastCities)
// //display the last 2 values

// localStorage.setItem("past cities", JSON.stringify(pastCities))

// citiesToShow=pastCities.splice(-5)
// console.log(citiesToShow)
// for(var i=0;i<citiesToShow.length;i++){
//     var x=document.createElement("p")
//     x.textContent=citiesToShow[i]
//     mydiv.append(x)
// }

// }


clearBtn.addEventListener("click",function(){
  localStorage.removeItem("savedSearches", JSON.stringify(userInputArr));    
  searchHistory.innerHTML = ""
 })


// myFunction()







//function () {
  //userInputArr = [];
  ///localStorage.removeItem("Location");
  //searchHistory.innerText = "";
  //searchHistory.removeChild(historyBtn);
  //$("past_searches").html('<div></div>'); 

//});

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
function saveRecentSearches() {
  var userSearchInput = document.getElementById("keywords").value
  if(!userInputArr.slice(-5).includes(userSearchInput)){
  userInputArr.push(userSearchInput);
}
  localStorage.setItem("savedSearches", JSON.stringify(userInputArr));
  displayRecentSearches();

}

//displaying resent 5 searches in html (need to set css for btn class)
function displayRecentSearches() {
  searchHistory.innerHTML = "";
  const recentFiveSearch = userInputArr.slice(-5);
  recentFiveSearch.forEach(function (item) {
    const historyBtn = document.createElement("button");
    historyBtn.textContent = item;
    historyBtn.style.textTransform = "capitalize";
    historyBtn.setAttribute("class", "btn");
    document.getElementById("past_searches").appendChild(historyBtn);

    historyBtn.addEventListener("click",function(){
      document.getElementById('keywords').value = ""
      var city=historyBtn.textContent 
      localStorage.setItem("Location",city) 
      initMap()
      getApi()

    }
    )
    
    // historyBtn.addEventListener("click", function (event) {
    //   console.log(event.target.textContent);
    //   const clickedCity = event.target.textContent;
    //   getApi(clickedCity);
    // })

  })
}

getApi()
// Initial array for cities buttons
var cities = [];

function displayWeather() {
    var city = $("#city-input").val();
    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    var forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`
    //ajax call for actual forcast display

    if (city == "") {
      console.log('true');
    } else 
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        //variable to declare the date
        var timeUTC = new Date(response.dt * 1000);
        //Display date and city name
      $(".cityDate").text(response.name +"  "+ '('+ (timeUTC.toLocaleDateString("en-US"))+')');
        //Display icon
        $('.icon').empty();
      var imgURL = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
      var image = $("<img>").attr("src", imgURL);
        $('.icon').append(image);
       //Display description
      $('.sky').text(response.weather[0].description);
       //Display temperature
      $('.temp').text('Temp: '+ response.main.temp + ' F');
        //Display wind speed
      $('.wind').text("Wind: "+ response.wind.speed +" MPH");
        //Display humidity
      $('.humidity').text("Humidity: " + response.main.humidity +'%');

        //generates cities array elements 
        var city = (response.name).trim().toUpperCase();
        //delete duplicate cities in array
        if (city == "") {
          console.log("error");
        } else {
          for(i=0;i<cities.length;i++) {
          if(cities[i]==city) {
          return;
          }
          }
        // Adding the city from the textbox to index [0] of our array
        cities.unshift(city);
        //calling function to display city button
        renderButtons(); 
        pastCities();
        //saving array to local storage
        localStorage.setItem('cityBtn', JSON.stringify(cities));
        };
       
    });   

    //ajax call for five days forcast display
    $.ajax({
        url: forcastURL,
        method: "GET"
      }).then(function(response) {
        // Array for 5-days 
        var day = [8, 16, 24, 32, 38];
        //creation of new div
        var fiveDayDiv = $(".fiveDays").addClass("card-text");
        fiveDayDiv.empty();
        // For each for 5 days
        day.forEach(function (i) {
            //var for date display
            var FiveDayTimeUTC = new Date(response.list[i].dt * 1000);
            FiveDayTimeUTC = FiveDayTimeUTC.toLocaleDateString("en-US");
            //Display of 5 days forecast
            fiveDayDiv.append("<div class=fiveDayDiv>" + "<p>" + FiveDayTimeUTC + "</p>" + 
            `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` 
            + "<p>"+ response.list[i].weather[0].description +"</p>"+ "<p>" + "Temp: " 
            + response.list[i].main.temp + " F</p>" + "<p>" + "Humidity: " 
            + response.list[i].main.humidity + "%" + "</p>" + "</div>");
        })
    });  
}
//function to display UV index
function getUv() {
var city = $("#city-input").val();
const APIKey = "d9680370698e25d5baff0233989f8bbc";
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
//ajax call for actual forcast display 
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      // UV Index URL
      var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;
      // UV Index ajax call
      $.ajax({
          url: urlUV,
          method: "GET"
      }).then(function (response) {
        //set default bacground color
        bkcolor = "violet";
        //convert UV value in number
        var uv = parseFloat(response.value);
        //set uv background color according to its index number
          if (uv < 3) { 
            bkcolor = 'green';
          } else if (uv < 6) { 
            bkcolor = 'yellow';
          } else if (uv < 8) { 
            bkcolor = 'orange';
          } else if (uv < 11) { 
            bkcolor = 'red';
          }
        //display uv index
        var uvDisplay = '<span>UV Index: </span>';
        var uvColor = uvDisplay + `<span style="background-color: ${bkcolor}; padding: 0 7px 0 7px;">${response.value}</span>`;
        $('.UV').html(uvColor);    
      });
    });
  } 
// creating cities buttons 
 function renderButtons() {
    $("#cityBtn").empty();
    // Looping through the array of cities
    for (var i = 0; i < cities.length; i++) {
      //creating button
      var c = $("<button>");
      // Adding a class to our button
      c.addClass("city btn btn-primary");
      // Adding a data-attribute
      c.attr("city-input", cities[i]);
      // Providing the initial button text
      c.text(cities[i]);
      // Adding the button to the HTML
      $("#cityBtn").append(c);
      
    } 
  }

//function to display weather info on click of cityBtn
function pastCities() {
  $(".btn-primary").click(function (){
    var d = $(this).attr('city-input');
    $("#city-input").prop("value", d);
    displayWeather();
    getUv();
    });
  }
  
// Adding a function to display cityBtn from localstorage
function init() {
  var storedCities = JSON.parse(localStorage.getItem("cityBtn"));
  if (storedCities !== null) {
      cities = storedCities;
  }
  renderButtons(cities);
}

//function to display the last city search if page reloaded
  $(window).on('load', function(){
    $("#city-input").prop("value", cities[0]);
    displayWeather();
    getUv();
    });

//Clear cities history
$(".btn-secondary").click(function (){
  localStorage.removeItem("cityBtn");
  location.reload();
  });

init();
pastCities();

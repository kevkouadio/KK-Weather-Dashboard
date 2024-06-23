// Initial array for cities buttons
var cities = [];

$(document).ready(function() {
  // Check if geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      getWeatherByLocation(lat, lon);
    }, function() {
      alert('Geolocation not supported or permission denied.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }

  // Event listener for the search button
  $("#searchcity").on("click", function() {
    displayWeather();
    getUv();
    $("#city-input").val("");
  });

  // Display weather based on city input
  function displayWeather() {
    var city = $("#city-input").val();
    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

    if (city == "") {
      console.log('true');
    } else {
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        updateWeatherInfo(response);
      });
      
      $.ajax({
        url: forecastURL,
        method: "GET"
      }).then(function(response) {
        updateFiveDayForecast(response);
      });
      getCityImg(city);
    }
  }

  // Fetch weather by location (latitude and longitude)
  function getWeatherByLocation(lat, lon) {
    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      updateWeatherInfo(response);
      var city = response.name;
      getCityImg(city); // Fetch city image using the obtained city name
    });

    $.ajax({
      url: forecastURL,
      method: "GET"
    }).then(function(response) {
      updateFiveDayForecast(response);
    });
  }

  // Update weather info in the UI
  function updateWeatherInfo(response) {
    var timeUTC = new Date(response.dt * 1000);
    $(".cityDate").text(response.name + "  " + '(' + (timeUTC.toDateString("en-US")) + ')');
    $('.icon').empty();
    var imgURL = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    var image = $("<img>").attr("src", imgURL);
    $('.icon').append(image);
    $('.sky').text(response.weather[0].description);
    $('.temp').text('Temp: ' + response.main.temp + ' F');
    $('.wind').text("Wind: " + response.wind.speed + " MPH");
    $('.humidity').text("Humidity: " + response.main.humidity + '%');
    setBackground(response.weather[0].description);

    var city = (response.name).trim().toUpperCase();
    if (city && !cities.includes(city)) {
      cities.unshift(city);
      renderButtons();
      pastCities();
      localStorage.setItem('cityBtn', JSON.stringify(cities));
    }
  }

  // Update five-day forecast in the UI
  function updateFiveDayForecast(response) {
    var day = [8, 16, 24, 32, 38];
    var fiveDayDiv = $(".fiveDays").addClass("card-text");
    fiveDayDiv.empty();
    day.forEach(function(i) {
      var FiveDayTimeUTC = new Date(response.list[i].dt * 1000);
      FiveDayTimeUTC = FiveDayTimeUTC.toDateString("en-US");
      fiveDayDiv.append("<div class=fiveDayDiv>" + "<p>" + FiveDayTimeUTC + "</p>" +
        `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">`
        + "<p>" + response.list[i].weather[0].description + "</p>" + "<p>" + "Temp: "
        + response.list[i].main.temp + " F</p>" + "<p>" + "Humidity: "
        + response.list[i].main.humidity + "%" + "</p>" + "</div>");
    });
  }

  // Set background image based on weather description
  function setBackground(description) {
    switch (description) {
      case 'Rain':
        $('body').css('background-image', 'url(Assets/rain.jpg)');
        break;
      case 'scattered clouds':
        $('body').css('background-image', 'url(Assets/scattered-clouds.jpg)');
        break;
      case 'few clouds':
        $('body').css('background-image', 'url(Assets/few-clouds.jpg)');
        break;
      case 'clear sky':
        $('body').css('background-image', 'url(Assets/clear-sky.jpg)');
        break;
      case 'broken clouds':
        $('body').css('background-image', 'url(Assets/broken-clouds.jpg)');
        break;
      case 'thunderstorm':
        $('body').css('background-image', 'url(Assets/thunderstorm.jpg)');
        break;
      case 'snow':
        $('body').css('background-image', 'url(Assets/snow.jpg)');
        break;
      case 'overcast clouds':
        $('body').css('background-image', 'url(Assets/overcast-clouds.jpg)');
        break;
      case 'light rain':
        $('body').css('background-image', 'url(Assets/light-rain.jpg)');
        break;
      default:
        $('body').css('background-image', 'url(Assets/default.jpg)');
        break;
    }
  }

  // Get UV index
  function getUv() {
    var city = $("#city-input").val();
    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;
      $.ajax({
        url: urlUV,
        method: "GET"
      }).then(function(response) {
        var bkcolor = "violet";
        var uv = parseFloat(response.value);
        if (uv < 3) {
          bkcolor = 'green';
        } else if (uv < 6) {
          bkcolor = 'yellow';
        } else if (uv < 8) {
          bkcolor = 'orange';
        } else if (uv < 11) {
          bkcolor = 'red';
        }
        var uvDisplay = '<span>UV Index: </span>';
        var uvColor = uvDisplay + `<span style="background-color: ${bkcolor}; padding: 0 7px 0 7px;">${response.value}</span>`;
        $('.UV').html(uvColor);
      });
    });
  }

  // Get city image from Unsplash
  function getCityImg(city) {
    var queryURL = `https://api.unsplash.com/search/photos?query=${city}&client_id=aRh4dCm8EGQRC8BR7vr0hFbFabB4UNyODFn94QV4sPM`;

    if (city != "") {
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        $('#city-img').empty();
        var imgURL = response.results[2].urls.small_s3;
        var img = $("<img>").attr("src", imgURL);
        img.width(250);
        $('#city-img').append(img);
      });
    }
  }

  // Create city buttons
  function renderButtons() {
    $("#cityBtn").empty();
    for (var i = 0; i < cities.length; i++) {
      var c = $("<button>");
      c.addClass("city btn btn-primary");
      c.attr("city-input", cities[i]);
      c.text(cities[i]);
      $("#cityBtn").append(c);
    }
  }

  // Display weather on pressing "Enter"
  $("#city-input").keypress(function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#searchcity").click();
    }
  });

  // Display weather info on city button click
  function pastCities() {
    $(".btn-primary").click(function() {
      var d = $(this).attr('city-input');
      $("#city-input").prop("value", d);
      displayWeather();
      getUv();
      $("#city-input").val("");
    });
  }

  // Display city buttons from local storage
  function init() {
    var storedCities = JSON.parse(localStorage.getItem("cityBtn"));
    if (storedCities !== null) {
      cities = storedCities;
    }
    renderButtons();
  }

  // Display last city search if page reloaded
  $(window).on('load', function() {
    if (cities.length > 0) {
      $("#city-input").prop("value", cities[0]);
      displayWeather();
      getUv();
      $("#city-input").val("");
    }
  });

  // Clear cities history
  $(".btn-secondary").click(function() {
    localStorage.removeItem("cityBtn");
    location.reload();
  });

  init();
  pastCities();
});

// Initial array for cities buttons
var cities = [];

$("#searchcity").click(function displayWeather(){
    var city = $("#city-input").val();

    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    var forcastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`
    //ajax call for actual forcast display
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

    //ajax call for five days forcast display
    $.ajax({
        url: forcastURL,
        method: "GET"
      }).then(function(response) {
        // Array for 5-days 
        var day = [0, 8, 16, 24, 32];
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
            + "<p>" + "Temp: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " 
            + response.list[i].main.humidity + "%" + "</p>" + "</div>");
        })
    });  
}); 

// creating cities buttons 
 function renderButtons() {
    $("#cityBtn").empty();
    // Looping through the array of cities
    for (var i = 0; i < cities.length; i++) {
      //creating button
      var c = $("<button>");
      // Adding a class to our button
      c.addClass("city btn btn-info");
      // Adding a data-attribute
      c.attr("city-input", cities[i]);
      // Providing the initial button text
      c.text(cities[i]);
      // Adding the button to the HTML
      $("#cityBtn").append(c);
    } 
  }

  // This function handles events where one button is clicked
  $("#searchcity").on("click", function(event) {
    // Preventing the buttons default behavior when clicked 
    event.preventDefault();
    // This line grabs the input from the textbox
    var city = $("#city-input").val().trim();
    // Adding the city from the textbox to our array
    cities.push(city);
    // Calling renderButtons which handles the processing of our city array
    renderButtons();
  });
// Adding a click event listener to all elements with a class of "movie-btn"


      // Adding a click event listener to all elements with a class of "movie-btn"
      $("#cityBtn").on("click", displayWeather());

      // Calling the renderButtons function to display the initial buttons
      renderButtons();

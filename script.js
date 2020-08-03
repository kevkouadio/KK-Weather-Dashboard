// Initial array for cities buttons
var cities = [];

$("#searchcity").click(function displayWeather(){
    var city = $("#city-input").val();

    const APIKey = "d9680370698e25d5baff0233989f8bbc";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        
      $(".cityDate").text(response.name);
      $('.temp').text('Temp: '+ response.main.temp + ' F');
      $('.wind').text("Wind: "+ response.wind.speed +" MPH");
      $('.humidity').text("Humidity: " + response.main.humidity +'%');
        console.log(response);
        
      });  
}); 

// creating cities buttons 
 function renderButtons() {

    $("#cityBtn").empty();

    // Looping through the array of cities
    for (var i = 0; i < cities.length; i++) {

      // Then dynamicaly generating buttons for each city in the array
      
      var c = $("<button>");
      // Adding a class of movie to our button
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
    // Preventing the buttons default behavior when clicked (which is submitting a form)
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
      $(document).on("click", "#cityBtn", displayWeather());

      // Calling the renderButtons function to display the initial buttons
      renderButtons();

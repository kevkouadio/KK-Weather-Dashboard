// Initial array of movies
var cities = [];

// Generic function for capturing the movie name from the data-attribute

 function renderButtons() {

    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise we will have repeat buttons)
    $("#cityBtn").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

      // Then dynamicaly generating buttons for each city in the array
      
      var c = $("<button>");
      // Adding a class of movie to our button
      c.addClass("city btn btn-info");
      // Adding a data-attribute
      c.attr("data-name", cities[i]);
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

  // Calling the renderButtons function to display the initial buttons
  renderButtons();
// Custom Javascript for Sudoku Web App

$(document).ready(function() {
  // LOADING FUNCTIONS
  // Used in beforeSend and complete options
  // of ajax calls that take extended period 
  // of time.
  var ajax_loading = function() {
    $("#alert").text("Loading...").show();
  };
  var end_ajax_loading = function() {
    $("#alert").hide();
  };

  // CLEAR ALERT
  // Function for clearing alert message
  var clear_message = function() {
    $("#alert").removeClass().hide();
  };

  // CLEAR COLOR
  // function for clearing color from puzzle
  var clear_color = function() {
    $("input").removeClass();
  }


  // HELPER
  // Ajax call when sudoku entry is changed
  $("input").on('input', function() {
    if ($("#helper").hasClass("on")) {
      //Captures the input changed
      var input = $(this);
      //Removes any current attached class
      input.removeClass();
      //Uses the id of the input to find its index
      //in the puzzle.
      var index = input.attr("id").split("-")[1];
      //Capture the value entered at the input
      var value = input.val();
      //If the value is nothing, i.e. the entry
      //has been deleted:
      //Send a request to the server indicating
      //that the entry at the index has been deleted
      if (value=="") {
        var uri = "json/remove?index=" + index;  
        $.ajax(uri, {
          success: function(response) {
          },
          error: function(request, errorType, errorMessage) {
            alert('Error: ' + errorType + ' with message: ' + errorMessage);
          }
        });
      //Otherwise send a request to the server with
      //the new value at the index.
      //If the value is correct the color will change to green
      //If incorrect the color will change to red
      } else {
        var uri = "json/add?index=" + index + "&entry=" + value;
        $.ajax(uri, {
          success: function(response) {
            if (response.correct) {
              input.addClass("correct");
            } else {
              input.addClass("incorrect");
            }
          },
          error: function(request, errorType, errorMessage) {
            alert('Error: ' + errorType + ' with message: ' + errorMessage);
          }
        });
      }
    }
  });

  // HELPER SWITCH
  // Switch to turn helper on and off
  $("#helper").click(function() {
    clear_color();
    clear_message();
    var helper = $(this);
    var current_class = helper.attr('class');
    if (current_class=="off") {
     helper.removeClass("off");
     helper.addClass("on");
     helper.text("Turn Helper Off");
     var uri = "json/check";
     var check_puzzle;
     $.ajax(uri, {
       success: function(response) {
         check_puzzle = response.check;
         $.each(check_puzzle, function(index, value) {
           var spot = "#space-" + index;
           var space = $(spot);
           if (!value) {
             space.addClass("incorrect");
           }
         });
       },
       error: function(request, errorType, errorMessage) {
         alert('Error: ' + errorType + ' with message: ' + errorMessage);
       }
     });
    } else {
     helper.removeClass("on");
     helper.addClass("off");
     helper.text("Turn Helper On");
     $("input").removeClass();
    }

  });

  // NEW PUZZLE
  // Button for loading new puzzle with ajax
  $("#new").click(function() {
    clear_message();
    var uri = "json/new";
    var new_puzzle;
    $.ajax(uri, {
      success: function(response) {
       new_puzzle = response.puzzle; 
       $.each(new_puzzle, function(index, value) {
         var spot = "#space-" + index;
         var entry;
         if (value==".") {
           entry = "";
         } else {
           entry = value;
         }
         $(spot).val(entry);
       });
      },
      error: function(request, errorType, errorMessage) {
        alert('Error: ' + errorType + ' with message: ' + errorMessage);
      },
      beforeSend: ajax_loading,
      complete: function() {
        end_ajax_loading();
        clear_color();
      }
    });
  });

  // CHECK PUZZLE
  // Button for checking current puzzle and
  // marking correct and wrong entries
  $("#check").click(function() {
    clear_color();
    clear_message();
    var uri = "json/check";
    var check_puzzle;
    $.ajax(uri, {
      success: function(response) {
        check_puzzle = response.check;
        $.each(check_puzzle, function(index, value) {
          var spot = "#space-" + index;
          var space = $(spot);
          if (value) {
            space.addClass("correct");
          } else {
            space.addClass("incorrect");
          }
        });
      },
      error: function(request, errorType, errorMessage) {
        alert('Error: ' + errorType + ' with message: ' + errorMessage);
      },
      complete: function() {
        setTimeout(function(){
          $("input").removeClass();
        }, 5000);
      }
    });
  });

  // SUBMIT PUZZLE
  // Button for submitting puzzle 
  // Shows message indicating whether puzzle is correct.
  $("#submit").click(function() {
    clear_color();
    clear_message();
    var uri = "json/complete";
    var alert_message = $("#alert");
    $.ajax(uri, {
      success: function(response) {
        var complete = response.complete;
        var accurate = response.accurate;
        var message;
        if (accurate) {
          message = "That's right! Great Job! Now try another...";
          alert_message.text(message).addClass("correct").show();
        } else if (complete) {
          message = "Sorry, something isn't right. Use 'Check Puzzle' to see what's wrong.";
          alert_message.text(message).addClass("incorrect").show();
        } else {
          message = "The puzzle isn't complete yet.";
          alert_message.text(message).addClass("incorrect").show();
        }
      },
      error: function(request, errorType, errorMessage) {
        alert('Error: ' + errorType + ' with message: ' + errorMessage);
      },
      complete: function() {
        setTimeout(function() {
          alert_message.removeClass().hide();
        }, 5000);
      }
    });
  });


});

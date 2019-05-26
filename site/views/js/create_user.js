"use strict";

function throw_error(e)  {console.log("PR ERROR: ", e); }


$( document ).ready(function() {

    $("#create_user").submit(function(event) {

        // Prevent the form from submitting via the browser.
        event.preventDefault();
        post_login_details();
    });
})

function new_login(pass_match)  {
    if(pass_match)
      location.reload(true);
    else
      $('.error_msg').show();
    return;
}

function post_login_details(){
  
    // Get form data
    var form_data = {
        username : $("#username").val(),
        password : $("#new_password").val()
        password2 : $("#new_password2").val()
    }

    // Make post request
    $.ajax({
        type        : "POST",
        contentType : "application/json",
        url         : "/create_user",
        data        : JSON.stringify(form_data),
        dataType    : 'json',
        success     : new_login,
        error       : throw_error
    });
      

}
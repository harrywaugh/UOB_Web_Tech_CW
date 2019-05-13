"use strict";

$(document).ready(login_open);
function login_open() { $('#login_button').click(show_login); }
function show_login()  { 
  $('#popup_login').css('z-index', 10000);
  $('#popup_login').css('opacity', 1);
}

$(document).ready(login_close);
function login_close() { $('#close_login').click(hide_login); }
function hide_login()  { 
  $('#popup_login').css('opacity', 0);
  $('#popup_login').css('z-index', -10000);

}

function throw_error(e)  { alert("Post Request Error!"); console.log("ERROR: ", e); }
function logged_in(valid_login)  {
	if(valid_login)  {
        $('#popup_login').fadeOut();
        location.reload(true);
        return;
	}
	$('#incorrect-login-msg').show();
	return;
}


$( document ).ready(function() {

  $("#login_form").submit(function(event) {
  	
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });
    
    
  function ajaxPost(){
      
    // Get form data
    var form_data = {
    	username : $("#username").val(),
        password : $("#password").val()
    }

    // Make post request
    $.ajax({
    	type        : "POST",
        contentType : "application/json",
        url         : "/login",
        data        : JSON.stringify(form_data),
        dataType    : 'json',
        success     : logged_in,
        error       : throw_error
    });
      
    $("#username").val("");
    $("#password").val("");

    }
})
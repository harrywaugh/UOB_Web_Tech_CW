"use strict";

function throw_error(e)  {console.log("ERROR: ", e); }
function reload_page()  {
  location.reload(true);
	return;
}


$( document ).ready(function() {

  $("#logout_button").click(function(event) {
    ajaxPost();
  });
    
  function ajaxPost(){
    // Make post request
    $.ajax({
    	type        : "POST",
      contentType : "application/json",
      url         : "/logout",
      dataType    : 'json',
      success     : reload_page,
      error       : throw_error
    });
  }
})
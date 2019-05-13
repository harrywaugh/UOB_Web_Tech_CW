"use strict";

$(document).ready(login_click);
function login_click() { $('#login_button').click(show_login); }
function show_login()  { $('#popup_login').slideDown(); }

function throw_error(e)  { alert("Error!"); console.log("ERROR: ", e); }


function logged_in(valid_login)  {
	if(valid_login)  {
        $('#popup_login').slideUp();
        return
	}
	return
}


$( document ).ready(function() {

  $("#login_form").submit(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });
    
    
  function ajaxPost(){
      
    // PREPARE FORM DATA
    var form_data = {
    	username : $("#username").val(),
        password : $("#password").val()
    }

    // DO POST
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

// $( document ).ready(function() {
  
//   // GET REQUEST
//   $("#allCustomers").click(function(event){
//     event.preventDefault();
//     ajaxGet();
//   });
  
//   // DO GET
//   function ajaxGet(){
//     $.ajax({
//       type : "GET",
//       url : window.location + "api/customers/all",
//       success: function(result){
//         $('#getResultDiv ul').empty();
//         var custList = "";
//         $.each(result, function(i, customer){
//           $('#getResultDiv .list-group').append(customer.firstname + " " + customer.lastname + "<br>")
//         });
//         console.log("Success: ", result);
//       },
//       error : function(e) {
//         $("#getResultDiv").html("<strong>Error</strong>");
//         console.log("ERROR: ", e);
//       }
//     });  
//   }
// })
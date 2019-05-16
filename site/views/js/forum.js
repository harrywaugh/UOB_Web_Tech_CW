
$(document).ready(hover_over_postbox);
function hover_over_postbox() {
    $('.postbox').hover(
       function(){ $(this).addClass('color_border'); },
       function(){ $(this).removeClass('color_border'); }
    );
}

$(document).ready(click_on_postbox);
function click_on_postbox() {
	$('.postbox').click(
		function(){ 
	   	$(this).addClass('abs_center'); 
	   	$('.background_shader').css('z-index', 1000); 
	});
}

$(document).ready(click_off_postbox);
function click_off_postbox() {
	$('.background_shader').click(
		function(){ 
	   	$('.postbox').removeClass('abs_center'); 
	   	$(this).css('z-index', -10000); 
	});
}

function throw_error(e)  { alert("Post Request Error!"); console.log("ERROR: ", e); }

function render_replies()  { console.log("Rendering replies: "); }



    
    
function get_post_replies(){
  
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
	    success     : render_replies,
	    error       : throw_error
	});
	  
	$("#username").val("");
	$("#password").val("");

}
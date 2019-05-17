$(document).ready( function () { $('.reply-textbox').hide(); });

$(document).ready(hover_over_postbox);
function hover_over_postbox() {
    $('.postbox').hover(
       function(){ $(this).addClass('color_border'); },
       function(){ $(this).removeClass('color_border'); }
    );
}

$(document).ready(click_on_postbox);
function click_on_postbox() {
	$('.postbox').click( function(){ 
		$(this).find('.reply-textbox').show();
	   	$(this).addClass('abs_center'); 
	   	$('.background_shader').css('z-index', 1000); 
	   	get_post_replies($(this).find(".input_post_id").val());
	});
}

$(document).ready(click_off_postbox);
function click_off_postbox() {
	$('.background_shader').click( function(){ 
		$('.abs_center').find('.reply-textbox').hide();
		var replies_container = $('.abs_center').find('.replies-container');
		while (replies_container.children().length > 2)  {
			replies_container.children().last().remove();
		}

	   	$('.postbox').removeClass('abs_center'); 
	   	$(this).css('z-index', -10000); 
	});
}

function throw_error(e)  { alert("Post Request Error!"); console.log("ERROR: ", e); }
function render_replies(html_string)  { 
	if( html_string == false )  return false;

	var replies_container = $('.abs_center').find('.replies-container');
	console.log(replies_container);
	replies_container.append(html_string);
}

    
function get_post_replies(post_id_val){
  	
	// Get form data
	var post_data = {
	    post_id : post_id_val
	}

	// Make post request
	$.ajax({
	    type        : "POST",
	    contentType : "application/json",
	    url         : "/get_replies",
	    data        : JSON.stringify(post_data),
	    dataType    : 'json',
	    success     : render_replies,
	    error       : throw_error
	});

}
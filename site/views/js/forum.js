$(document).ready( function () { $('.reply-textbox').hide(); });
var selected = false;
$(document).ready(hover_over_postbox);
function hover_over_postbox() {
    $('.postbox').hover(
       function(){ $(this).addClass('color_border'); },
       function(){ $(this).removeClass('color_border'); }
    );
}

function hover_over_clicked_postbox() {
    $('.postbox').hover(
       function(){ $(this).addClass('color_border'); }
    );
}

$(document).ready(click_on_postbox);
function click_on_postbox() {
	$('.postbox').click( function(){
        if (!selected)  {
            selected = true;

    		$(this).addClass('color_border');
    		$(this).find('.reply-textbox').show();

    		hover_over_clicked_postbox();
    	   	$(this).addClass('abs_center');
    	   	$('.background_shader').css('z-index', 1000);
    	   	get_post_replies($(this).find(".input_post_id").val());
    	   	$("html, body").animate({ scrollTop: 0 }, "slow");
        }

	});
}

$(document).ready(click_off_postbox);
function click_off_postbox() {
	$('.background_shader').click( function(){
        $('.abs_center').find('.reply-textbox').hide();
		selected = false;
		var replies_container = $('.abs_center').find('.replies-container');
		while (replies_container.children().length > 2)  {
			replies_container.children().last().remove();
		}
	   	$('.postbox').removeClass('abs_center');
	   	$('.postbox').removeClass('color_border');
	   	hover_over_postbox();
	   	$(this).css('z-index', -10000);
	});
}

function throw_error(e)  {console.log("ERROR: ", e); }
function render_replies(html_string)  {
	if( html_string == false )  return false;

	var replies_container = $('.abs_center').find('.replies-container');
	console.log(html_string);
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

$(document).ready(function() {

    $(".reply_forum").submit( function(event) {

        // Prevent the form from submitting via the browser.
        event.preventDefault();
        post_reply(this);

    });
});

function post_reply(form) {

    // Get form data
    var form_data = {
        reply   : $(form).find('.textarea').val(),
        post_id : $(form).find(".input_post_id").val()
    }
    console.log(form_data);
    // Make post request
    $.ajax({
        type        : "POST",
        contentType : "application/json",
        url         : "/reply_to_post",
        data        : JSON.stringify(form_data),
        dataType    : 'json',
        success     : render_replies,
        error       : throw_error
    });

    $(form).find('.textarea').val("");

}

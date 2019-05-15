
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
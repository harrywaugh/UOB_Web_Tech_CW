
$(document).ready(hover_over);

function hover_over() {
	$('.postbox').hover(
       function(){ $(this).addClass('color_border') },
       function(){ $(this).removeClass('color_border') }
	);
}


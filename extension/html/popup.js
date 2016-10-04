$( 'document' ).ready(function() {
	
	showWorkView();
	
	$( '#accept_cart_button' ).on( 'click', function() {
		acceptCart();
	});
	
	$( '#reject_cart_button' ).on( 'click', function() {
		rejectCart();
	});
	
	$( '#start_listening_button' ).on( 'click', function() {
		startListening();
	});
	
	$( '#stop_listening_button' ).on( 'click', function() {
		stopListening();
	});
});

function showWorkView() {
	$( '#home_base' ).show();
	$( '#top_light_grey' ).show();
	$( '#grey_divider' ).show();
	$( '#bottom_dark_grey' ).show();
	$( '#start_listening_button' ).show();
	$( '#stop_listening_button' ).show();
	$( '#cart_items_div_holder' ).hide();
}

function startListening() {
	// send get-properties notification to background script
	chrome.extension.sendMessage({
		name: "start-listening"
	});
}

function stopListening() {
	// send get-properties notification to background script
	chrome.extension.sendMessage({
		name: "stop-listening"
	});
}

/*
function getSmallLogo() {
	$( '.name' ).animate({
		"font-size": "18px"
	},100, function(){});
}

function getBigLogo() {
	$( '.name' ).animate({
		"font-size": "30px"
	},100, function(){});
}
*/
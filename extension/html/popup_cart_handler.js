var extractedData = '';
var listing_data  = [];

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.name) {
        case "properties-were-extracted":
			showExtractedCart(message.all_data)
			break;
		default:
			break;
    }
});

function showExtractedCart(data) {
	
	listing_data =  JSON.parse(data);

	var property_object = ' ', div_id = '', msg_id = '', list_price = '', offer_price = '', factor = '';
	for (i=0; i<listing_data.length; i++) {
		div_id = 'property_container_' + i;
		msg_id = 'return_message_' + i;
	 	property_object = property_object + '<div class="property_div">';
		property_object = property_object + '<div class="prop_image"><img alt="image" width="120" src="' + listing_data[i].PHOTOPRIMARY + '"></div>';
	 	property_object = property_object + '<div class="prop_container" id="' + div_id + '">';
	 	property_object = property_object + '<span class="agent_name"><b>Agent Name:</b> ' + listing_data[i].AGENTLISTNAME + ' </span><br>';
	 	property_object = property_object + '<span class="agent_id"><b>Agent List Id:</b> ' + listing_data[i].AGENTLISTID + ' </span><br>';
	 	property_object = property_object + '<span class="mls_num"><b>MLS Number:</b> ' + listing_data[i].MLS_NUM + ' </span><br>';
	 	property_object = property_object + '<span class="agent_num"><b>Agent Number:</b> ' + listing_data[i].AGENT_PHOTO_NUM + ' </span><br>';
	 	property_object = property_object + '<span class="office_list_id"><b>Office List Id:</b> ' + listing_data[i].OFFICELISTID + ' </span><br>';
	 	property_object = property_object + '<span class="address"><b>Street Address:</b> ' + listing_data[i].FULLSTREETADDRESS + ' </span><br>';
	 	property_object = property_object + '<span class="city"><b>City, Zip:</b> ' + listing_data[i].CITY + ', </span>';
	 	property_object = property_object + '<span class="zip"> ' + listing_data[i].ZIP + ' </span><br>';
	 	property_object = property_object + '<span class="office_email"><b>Office Email:</b> ' + listing_data[i].OFFICEEMAIL + ' </span><br>';
		
		factor = $( '#offer_perc' ).val() / 100
		list_price  = Number(listing_data[i].LISTPRICE).formatMoney(2, '.', ',');
		offer_price = Number(factor * listing_data[i].LISTPRICE).formatMoney(2, '.', ',');
		
	 	property_object = property_object + '<span class="price"><b>Price:</b> $' + list_price + ' </span><br>';
	 	property_object = property_object + '<span class="price_offer"><b>Price Offer:</b> $' + offer_price + ' </span><br>';
		
	 	property_object = property_object + '</div>';
	 	property_object = property_object + '</div>';
	 	property_object = property_object + '<div><span class="return_message" id="' + msg_id + '"></span></div>';
	 	property_object = property_object + '<div class="property_bar"></div>';
	};
	
	$( '#cart_items_div_sub1' ).html(property_object);
	//$( '#cart_items_div_holder' ).show("bounce",{times:1,distance:50},1500);
	$( '#cart_items_div_holder' ).show("drop",{direction:'up'},300);

}

Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
		c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function acceptCart() {
	
	var msg_id = '', factor = '', offer_price = '', address = '', mls_number = '';
	for (i=0; i<listing_data.length; i++) {
		msg_id = 'return_message_' + i;
		$( '#email_nonhar_mlsnum' ).val(listing_data[i].MLS_NUM);
		$( '#email_nonhar_AgentKey' ).val(listing_data[i].AGENTLISTID);
		$( '#email_mlsnum' ).val(listing_data[i].MLS_NUM);
		$( '#email_member_number' ).val(listing_data[i].AGENT_PHOTO_NUM);
		$( '#email_office_id' ).val('');
		$( '#email_brokercode' ).val(listing_data[i].OFFICELISTID);
		$( '#email_paddress' ).val(listing_data[i].FULLSTREETADDRESS);
		$( '#email_photolink' ).val(listing_data[i].PHOTOPRIMARY);
		//$( '#email_subject' ).val('Request more information for ' + listing_data[i].FULLSTREETADDRESS);
		$( '#email_subject' ).val('Letter of intent to purchase ' + listing_data[i].FULLSTREETADDRESS);
		$( '#email_messageid' ).val('1');
		
		factor      = $( '#offer_perc' ).val() / 100;
		agent_name  = listing_data[i].AGENTLISTNAME;
		offer_price = Number(factor * listing_data[i].LISTPRICE).formatMoney(2, '.', ',');
		address     = listing_data[i].FULLSTREETADDRESS;
		city        = listing_data[i].CITY;
		state       = listing_data[i].STATE;
		mls_number  = listing_data[i].MLS_NUM;
		
		createMessage(agent_name,offer_price,address,city,state,mls_number);
		
		(function(msg_id) {
			$.ajax({
				url:'http://search.har.com/_leadtrack/doSendAgentEmail_beta.cfm',
				type:'post',
				data:$('#emailForm').serialize(),
				success:function(data){
					document.getElementById(msg_id).innerHTML = data;
				},
				error: function() { onAcceptCartError(); }
			});
		}(msg_id));
	};
}

function onAcceptCartSuccess() {
	$( '#cart_items_div_sub1' ).effect("highlight", {color: "#ffffcc"}, 500, hideCart);
}

function hideCart() {
	$( '#cart_items_div_holder' ).hide( "scale", {}, 200 );
	$( '#extract_cart_button' ).show();
	$( '#end_session_button' ).show();
}

function onAcceptCartError() {
	showWorkView();
	$( '#alert_info' ).html( 'Sorry, unable to process at his time!' );
	$( '#alert_paragraph' ).show();
	$( '#alert_paragraph' ).effect("pulsate", {}, 1500);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function createMessage(agent_name,offer_price,address,city,state,mls_number) {
	var msg = $("textarea#email_template").val();
	var msg = msg.replace(/\{\{AGENT\}\}/g,   toTitleCase(agent_name));
	var msg = msg.replace(/\{\{OFFER\}\}/g,   '$' + offer_price);
	var msg = msg.replace(/\{\{ADDRESS\}\}/g, toTitleCase(address));
	var msg = msg.replace(/\{\{CITY\}\}/g,    toTitleCase(city));
	var msg = msg.replace(/\{\{STATE\}\}/g,   toTitleCase(state));
	var msg = msg.replace(/\{\{MLS\}\}/g,     mls_number);
	var msg = msg.replace(/\{\{DATE\}\}/g,    getTodaysDate());
	$("textarea#email_messagebody").val(msg);
	alert(msg);
}

function resetUserData(offer_perc, message, firstname, lastname, email, tel1, tel2, tel3){
	$( '#offer_perc' ).val(offer.percentage);
	$( '#email_template' ).val(offer.message);
	$( '#email_firstname' ).val(user.firstname);
	$( '#email_lastname' ).val(user.lastname);
	$( '#email_email' ).val(user.email);
	$( '#email_phone1' ).val(user.tel1);
	$( '#email_phone2' ).val(user.tel2);
	$( '#email_phone3' ).val(user.tel3);
}

function getTodaysDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	today = mm+'/'+dd+'/'+yyyy;
	
	return today;
}
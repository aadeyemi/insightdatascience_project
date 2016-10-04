// listening for an event / one-time requests coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.name) {
        case "start-listening":
		startListening();
        	break;
        case "stop-listening":
		stopListening();
       		break;
    }
    return true;
}); 
 
// get script then send to content script
function startListening () {
	
    chrome.tabs.getSelected(null, function(tab){
		$.ajax({
			url: 'http://localhost/insight_project/injection_scripts/get_injection_script.php',
			type: 'POST',
			data: { data : tab.url, type : "start" },
			dataType: 'text',
			success: function(data_b64) {
				var job = atob(data_b64);
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {
						name: "run-script", 
						script_ascii: job
					});
				});
			}
		});
		
    });
}
 
// get script then send to content script
function stopListening () {
	
	chrome.tabs.getSelected(null, function(tab){
		$.ajax({
			url: 'http://localhost/insight_project/injection_scripts/get_injection_script.php',
			type: 'POST',
			data: { data : tab.url, type : "stop" },
			dataType: 'text',
			success: function(data_b64) {
				var job = atob(data_b64);
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {
						name: "run-script", 
						script_ascii: job
					});
				});
			}
		});	
	});
}
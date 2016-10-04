var user_id = '';

// create listener for script output, send to cart handler
document.addEventListener('startedListening', function(data) {
	chrome.runtime.sendMessage({
		name: 'listening-has-started',
		all_data: data.detail.all_data
	});
	/*removeScriptFromDocument();*/ // handled manually
});

document.addEventListener('stoppedListening', function(data) {
	/*removeScriptFromDocument();*/ // handled manually
});

function removeScriptFromDocument() {
	var element = document.getElementById('injected_script');
	element.parentNode.removeChild(element);
}

// content script to inject extraction script in webpage
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch (message.name) {
		case "run-script":
			/*
			// remove any existing injected script
			var element = document.getElementById('injected_script');
			element.parentNode.removeChild(element);
			*/
			
			// create extraction script element
			var script_text = message.script_ascii;
			
			var extract_script = document.createElement('script');
			extract_script.setAttribute("id", "injected_script");
			extract_script.text = script_text;
			
			// append to document
			(document.body||document.documentElement).appendChild(extract_script);
			break;
		default:
			break;
	}
});
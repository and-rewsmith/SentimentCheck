


function search(){
	var xhr = createCORSRequest("GET", "https://console.firebase.google.com/project/charitycheck-check/database/charitycheck-check/data");
	xhr.onload = function() {
		var text = xhr.responseText;
		var title = getTitle(text);
		alert('Response from CORS request to lol');
  	};

  	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

  	xhr.send();
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://charitycheck-check.firebaseio.com/lol.json",
        success: function(data) {
            console.log(data);
        }
    });
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}


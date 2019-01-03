/**
* @class CGFresourceReader
*
* Structure that reads an xml file and calls method #onXMLReady or
* method #onXMLError from a callbackObj, depending whether the read operation was successfull.
*
*/
var indexOf = function(needle) {
	if(typeof Array.prototype.indexOf === 'function') {
		indexOf = Array.prototype.indexOf;
	} else {
		indexOf = function(needle) {
			var i = -1, index = -1;

			for(i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					index = i;
					break;
				}
			}

			return index;
		};
	}
	return indexOf.call(this, needle);
};

/** @private @property {String} xmlhttp internal variable containg the http request. */
/** @private @property {request} xmlDoc the content that was read from the url resource. */
/** @private @property {String} resource the url of the resource (xml file) to read. */
/** @private @property {Object} callbackObj an object that requires two methods: onXMLReady() and onXMLError(message) */
/** @private @property {String} errorMessage an error message resulting from the read process. */


/**
 * @method CGFresourceReader
 * @constructor
 * Creates a XML Reader with the default values
  */
CGFresourceReader = function() {

	this.xmlhttp = null;
	this.xmlDoc = null;
	this.resource = null;
	this.callbackObj = null;
	this.errorMessage = null;
};

CGFresourceReader.prototype.constructor = CGFresourceReader;

/** @method getErrorMessage
* Getter of the error message string, if an error happend
*/
CGFresourceReader.prototype.getErrorMessage = function() {
	return this.errorMessage;
};

/** @method open
* Opens the url resource from #resource and reads its contents. On success calls the
* method onResourceReady from the #callbackObj. On error calls the method
* onResourceError from the #callbackObj.
* @param {String} resource the url of the resource (xml file) to be read
* @param {Object} callbackObj an object containing methods onResourceReady() and onResourceError(message)
*/
CGFresourceReader.prototype.open = function(resource, callbackObj) 
{
	this.resource = resource;
	if (! callbackObj.onResourceReady)
		console.error("CGFresourceReader.open: onResourceReady handler not defined.");

	if (! callbackObj.onResourceError)
		console.error("CGFresourceReader.open: onResourceError handler not defined.");
	
	this.callbackObj = callbackObj;

	if (window.XMLHttpRequest) {
		this.xmlhttp=new XMLHttpRequest();                            // For all modern browsers
	} 
	else if (window.ActiveXObject) {
		this.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");   		// For (older) IE
	}

	if (this.xmlhttp != null)  {

		this.xmlhttp.onload = this.onStateChange;
		this.xmlhttp.reader = this;
		this.xmlhttp.open("GET", resource, true); //  (httpMethod,  URL,  asynchronous)			
		this.xmlhttp.setRequestHeader("Content-Type", "text/xml");
		this.xmlhttp.send(null);
	}
	else {
		reader.callbackObj.onResourceError("The XMLHttpRequest is not supported");
		return;
	}
};


CGFresourceReader.prototype.onStateChange = function() {

  if (this.readyState==4) {  // 4 => loaded complete
	if (this.status==200) {  // HTTP status code  ( 200 => OK )
		var parser = new window.DOMParser();
		var reader = this.reader;
		var response = this.reader.xmlhttp;
		var text = response.responseText;
		
		reader.callbackObj.onResourceReady(text);
		
		if (reader.getErrorMessage() != null) {
			reader.callbackObj.onResourceError(reader.getErrorMessage());
			return;
		}
		
	  } 
	  else {
		var reader = this.reader;
		reader.callbackObj.onResourceError(this.status + ": " + reader.resource + ", " + this.statusText);
	  } 
   }  
};

	
	
	
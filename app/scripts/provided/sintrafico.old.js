// Google maps layers used for integration with SinTrafico

var overlayList = Array();
var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();
var initialized = false;

// Initialize the map and the custom overlay.
// var storePosition = {lat: 19.5471315, lng: -99.2024959};

function initSinTraficoMap(storePosition, element) {
	var map = new google.maps.Map(document.getElementById(element), {
		zoom: 13,
		center: storePosition
	});

	var marker = new google.maps.Marker({
		position: storePosition,
		map: map
	});

	google.maps.event.addListener(map,'idle', function() {
		var bounds = map.getBounds();
		var height = Math.round($('#' + element ).height());
		var width = Math.round($('#' + element).width());
		var key = 'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177';
		var parms = '?key=' + key 
				+ '&bbox=' + bounds.getSouthWest().lng() + ',' + bounds.getSouthWest().lat() + ',' 
				+ bounds.getNorthEast().lng() + ',' + bounds.getNorthEast().lat()
				+ '&height=' + height + '&width=' + width;

		// Layer photography
		var srcImage = 'http://tile.sintrafico.com/wms/heatmap.png' + parms;

		// The custom USGSOverlay object contains the USGS image,
		// the bounds of the image, and a reference to the map.

		overlay = new USGSOverlay(bounds, srcImage, map);
		overlayList.push(overlay);
	});
}

/** @constructor */
function USGSOverlay(bounds, image, map) {

	// Initialize all properties.
	this.bounds_ = bounds;
	this.image_ = image;
	this.map_ = map;

	// Define a property to hold the image's div. We'll
	// actually create this div upon receipt of the onAdd()
	// method so we'll leave it null for now.
	this.div_ = null;

	// Explicitly call setMap on this overlay.
	this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
USGSOverlay.prototype.onAdd = function() {

	var divLoader = document.createElement('div');
	divLoader.style.borderStyle = 'none';
	divLoader.style.borderWidth = '0px';
	divLoader.style.position = 'absolute';
	divLoader.style.width = '100%';
	divLoader.style.height = this.map.getDiv().clientHeight + 'px';
	divLoader.style.backgroundImage = "url('/styles/img/ajax-loader.gif')";
	divLoader.style.backgroundRepeat = 'no-repeat';
	divLoader.style.backgroundPosition = 'center';
	divLoader.style.backgroundColor = '#65658c';
	divLoader.style.opacity = '.4';
	divLoader.id = 'divLoader';

	var div = document.createElement('div');
	div.style.borderStyle = 'none';
	div.style.borderWidth = '0px';
	div.style.position = 'absolute';

	// Create the img element and attach it to the div.
	var img = document.createElement('img');
	img.src = this.image_;
	img.style.width = '100%';
	img.style.height = '100%';
	img.style.position = 'absolute';
	img.onload = function() {
		for( var i = 0; i < (overlayList.length - 1); i++ ) {
			overlayList[i].onRemove();
		}
		document.getElementById('divLoader').parentNode.removeChild(document.getElementById('divLoader'));
	}
	div.appendChild(img);

	this.div_ = div;
	this.loader_ = divLoader;

	// Add the element to the "overlayLayer" pane.
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
	this.map.getDiv().appendChild(divLoader);
};

USGSOverlay.prototype.draw = function() {

	// We use the south-west and north-east
	// coordinates of the overlay to peg it to the correct position and size.
	// To do this, we need to retrieve the projection from the overlay.
	var overlayProjection = this.getProjection();

	// Retrieve the south-west and north-east coordinates of this overlay
	// in LatLngs and convert them to pixel coordinates.
	// We'll use these coordinates to resize the div.
	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

	// Resize the image's div to fit the indicated dimensions.
	var div = this.div_;
	if( div != null ) {
		div.style.left = sw.x + 'px';
		div.style.top = ne.y + 'px';
		div.style.width = (ne.x - sw.x) + 'px';
		div.style.height = (sw.y - ne.y) + 'px';
	}
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function() {
	if( this.div_ != null ) 
		this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
};

// Returns vehicle flow for a location
function getFlow(storePosition, success, fail) {
	var parameters =  {
		'key': 'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
		'lat': storePosition.lat,
		'lon': storePosition.lng
	};

	$.getJSON('http://api.sintrafico.com/flow', parameters)
		.done(function(data, textStatus, jqXHR) {
			
			// Wait a second for the next request
			window.setTimeout(function(){
				delayFlowResponse(data.req_id, success, fail);
			}, 1000)

		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log('Error ' + jqXHR.status);
			if( fail !== undefined ) fail();
		})
}

// Function to be called after the SinTrafico request ID is received
function delayFlowResponse(req_id, success, fail) {
	var statusCode = 0;
	var parameters =  {
		'key': 'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
		'req_id': req_id,
	};
	$.getJSON('http://api.sintrafico.com/flow', parameters)
		.done(function(data, textStatus, jqXHR) {
			statusCode = jqXHR.status
			if (statusCode == 202) {

				// Wait a second for the next request
				window.setTimeout(function(){
					delayFlowResponse(req_id, success, fail);
				}, 1000)

			} else if (statusCode == 200) {
				if( success !== undefined ) success(data);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log('Error ' + jqXHR.status);
			if( fail !== undefined ) fail();
		})
}

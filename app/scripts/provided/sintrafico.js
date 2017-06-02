// Google maps layers used for integration with SinTrafico

var initialized = false;

var map, heatmap;

// Initialize the map and the custom overlay.
// var storePosition = {lat: 19.5471315, lng: -99.2024959};

function initSinTraficoMap(storePosition, element, layer) {

	if( layer === undefined || layer == null ) 
		layer = 'heatmap.json';

	var map = new google.maps.Map(document.getElementById(element), {
		zoom: 13,
		center: storePosition
	});

	var marker = new google.maps.Marker({
		position: storePosition,
		map: map
	});

    heatmap = new google.maps.visualization.HeatmapLayer({
        map: map,
        radius: 50,
        opacity: 0.3
    });

    google.maps.event.addListener(map, 'idle', function(){
        heatmap.set('radius', 5.8333*map.getZoom()-64.167);
        updateLayer(map.getBounds(),layer);        
    });
}

// Heatmap data: 500 Points
function updateLayer(b, layer) { // Google Maps Bounds
    var bounds = [b.getSouthWest().lng(), b.getSouthWest().lat(),  b.getNorthEast().lng(), b.getNorthEast().lat()];
    console.log(layer);
    var url = 'http://tile.sintrafico.com/rawlayers/' + layer + '?bbox='+bounds[0]+','+bounds[1]+','+bounds[2]+','+bounds[3]+'&apiKey=e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177';
    ajax(url, function(data){
        var points = [];
        for (var i=0;i<data.points.length;i++){
            points.push({location: new google.maps.LatLng(data.points[i].lat, data.points[i].lon), weight: data.points[i].c});
        }
        heatmap.set('data', points);
    });
}

function ajax(url, cb) {  // ajax request
    if (window.XMLHttpRequest === undefined) {
        window.XMLHttpRequest = function() {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP.6.0");
            }
            catch  (e1) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP.3.0");
                }
                catch (e2) {
                    throw new Error("XMLHttpRequest is not supported");
                }
            }
        };
    }
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function() {
        var response = {};
        if (request.readyState === 4 && request.status === 200) {
            try {
                if(window.JSON)
                    response = JSON.parse(request.responseText);
                else
                    response = eval("("+ request.responseText + ")");
            } catch(err) {
                response = {};
                throw new Error('Ajax response is not JSON');
            }
            cb(response);
        }
    };
    request.send();
    return request;
}

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

// Returns vehicle origin destiny  for a location.
function getOriginWork(lat, lon, mapa, success, fail) {
    var parameters =  {
        'key':      'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
        'lat':      lat,
        'lon':      lon,
        'origin':   'start',
        'time':     'morning'
    };

    var result = null;

    $.getJSON('http://api.sintrafico.com/trips', parameters)
        .done(function(data, textStatus, jqXHR) {
            if (textStatus == 'success') {
                $.each( data.result, function( i, item ) {

                    map.drawCircle({
                        lat: item.centroid[0],
                        lng: item.centroid[1],
                        fillColor: '#b9390f',
                        fillOpacity: 0.2,
                        strokeColor: '#b9390f',
                        strokeWeight: 1,
                        radius: item.average_radius
                    });
                });
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Error ' + jqXHR.status);
        })

    return result;
}   

// Returns vehicle origin destiny  for a location.
function getDestinyWork(lat, lon, mapa, success, fail) {
    var parameters =  {
        'key':      'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
        'lat':      lat,
        'lon':      lon,
        'origin':   'end',
        'time':     'morning'
    };

    var result = null;

    $.getJSON('http://api.sintrafico.com/trips', parameters)
        .done(function(data, textStatus, jqXHR) {
            if (textStatus == 'success') {
                $.each( data.result, function( i, item ) {

                    map.drawCircle({
                        lat: item.centroid[0],
                        lng: item.centroid[1],
                        fillColor: '#777',
                        fillOpacity: 0.2,
                        strokeColor: '#777',
                        strokeWeight: 1,
                        radius: item.average_radius
                    });
                });
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Error ' + jqXHR.status);
        })
    return result;
} 

// Returns vehicle origin destiny  for a location.
function getOriginHome(lat, lon, mapa, success, fail) {
    var parameters =  {
        'key':      'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
        'lat':      lat,
        'lon':      lon,
        'origin':   'start',
        'time':     'night'
    };

    var result = null;

    $.getJSON('http://api.sintrafico.com/trips', parameters)
        .done(function(data, textStatus, jqXHR) {
            if (textStatus == 'success') {
                $.each( data.result, function( i, item ) {

                    map.drawCircle({
                        lat: item.centroid[0],
                        lng: item.centroid[1],
                        fillColor: '#c3af05',
                        fillOpacity: 0.2,
                        strokeColor: '#c3af05',
                        strokeWeight: 1,
                        radius: item.average_radius
                    });
                });
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Error ' + jqXHR.status);
        })
    return result;
}   

// Returns vehicle origin destiny  for a location.
function getDestinyHome(lat, lon, mapa, success, fail) {
    var parameters =  {
        'key':      'e3d5b3f4b180e43558c1908b04f85f9e73de94b31777a8eb2ab844fd9296f177',
        'lat':      lat,
        'lon':      lon,
        'origin':   'end',
        'time':     'night'
    };

    var result = null;

    $.getJSON('http://api.sintrafico.com/trips', parameters)
        .done(function(data, textStatus, jqXHR) {
            if (textStatus == 'success') {
                $.each( data.result, function( i, item ) {

                    mapa.drawCircle({
                        lat: item.centroid[0],
                        lng: item.centroid[1],
                        fillColor: '#1ab394',
                        fillOpacity: 0.2,
                        strokeColor: '#1ab394',
                        strokeWeight: 1,
                        radius: item.average_radius
                    });
                });
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Error ' + jqXHR.status);
        })
    return result;
}   
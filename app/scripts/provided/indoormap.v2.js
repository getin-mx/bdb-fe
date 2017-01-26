/**
 * IndoorMap.js
 * 
 * Library for making map location points inside a venue. It uses a png map, and
 * a series of positioning points to show the specific recorded points. It also
 * crosses this series of points with a heat map generator to specify the amount
 * of type that each person spent in a specific location
 */

// Global variables
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag
var _debug = $('debug');    // makes life easier
var wifiSpots = null;
var trackCache = null;
var trackIndex = 0;
var mapActive = 1;

// Encapsulated Library Definition
indoormap = {

		/**
		 * Obtains the browser query string
		 * 
		 * @returns an array with all the parameters sent in the browser query
		 *          string
		 */
		queryString : function () {
			// This function is anonymous, is executed immediately and 
			// the return value is assigned to QueryString!
			var query_string = {};
			var query = window.location.href;
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = pair[1];
					// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
					var arr = [ query_string[pair[0]], pair[1] ];
					query_string[pair[0]] = arr;
					// If third or later entry with this name
				} else {
					query_string[pair[0]].push(pair[1]);
				}
			} 
			return query_string;
		},

		/**
		 * Initialize the library defining the mousedown and mouseup methods
		 * used to track the points movement
		 */
		init: function() {

			/**
			 * Mouse down event (start drag)
			 */
			document.onmousedown = function(e) {
				// IE is retarded and doesn't pass the event object
				if (e == null) 
					e = window.event; 

				// IE uses srcElement, others use target
				var target = e.target != null ? e.target : e.srcElement;

				// for IE, left click == 1
				// for Firefox, left click == 0
				if ((e.button == 1 && window.event != null || 
						e.button == 0) && 
						target.className == 'draggable')
				{
					// grab the mouse position
					_startX = e.clientX;
					_startY = e.clientY;

					// grab the clicked element's position
					_offsetX = indoormap.extractNumber(target.style.left);
					_offsetY = indoormap.extractNumber(target.style.top);

					// bring the clicked element to the front while it is being dragged
					_oldZIndex = target.style.zIndex;
					target.style.zIndex = 10000;

					// we need to access the element in OnMouseMove
					_dragElement = target;

					// tell our code to start moving the element with the mouse
					document.onmousemove = function(e) {
						if (e == null) 
							var e = window.event; 

						// this is the actual "drag code"
						_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
						_dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
					};

					// cancel out any text selections
					document.body.focus();

					// prevent text selection in IE
					document.onselectstart = function () { return false; };
					// prevent IE from trying to drag an image
					target.ondragstart = function() { return false; };

					// prevent text selection (except IE)
					return false;
				}
			};

			/**
			 * Mouse Up Event (Stop drag)
			 */
			document.onmouseup = function(e) {
				if (_dragElement != null) {
					_dragElement.style.zIndex = _oldZIndex;

					// we're done with these events until the next OnMouseDown
					document.onmousemove = null;
					document.onselectstart = null;
					_dragElement.ondragstart = null;

					// this is how we know we're not dragging      
					_dragElement = null;
				}
			};
		},

		/**
		 * Loads a FloorMap object with the data point contents, and translate
		 * the info as a javascript object
		 * 
		 * @param identifier
		 *            The Map element to load. This is the FloorMap object
		 *            identifier to look for, as the rest of the URL is dictated
		 *            by hardcode.
		 * @returns The loaded and parsed data set
		 */
		loadAndParseURL: function(baseUrl, token, identifier) {
			var dataReturn = {};

			url = baseUrl + '/dashboard/floormapData?authToken=' + token + '&floorMapId=' + identifier;

			$.ajax({
				url:        url,
				async:      false,
				cache:		false,
				contentType:'text/plain',
				dataType:   'text',
				success:    function(data, status) {
					dataReturn = indoormap.parseData(data); 
				},
				error:		function() {},
				failure:	function() {}
			});

			return dataReturn;
		},

		/**
		 * Loads a local file or URL that contains the FloorMap object with the
		 * data point contents, and translate the info as a javascript object
		 * 
		 * @param filename
		 *            The file name or url to load
		 * @returns The loaded and parsed data set
		 */
		loadAndParseFile: function(filename) {
			var dataReturn = {};

			$.ajax({
				url:        filename,
				async:      false,
				cache:		false,
				contentType:'text/plain',
				dataType:   'text',
				success:    function(data, status) {
					dataReturn = indoormap.parseData(data); 
				},
				error:		function() {},
				failure:	function() {}
			});

			return dataReturn;
		},

		/**
		 * Parses raw data loaded with information about WifiSpots
		 * 
		 * @param json
		 *            The json content to parse
		 * @returns A full formed javascript object with the parsed FloorMap
		 *          information
		 */
		parseData: function(json) {
			var data = JSON.parse(json);
			if( data.corrected == undefined )
				data.corrected = false;
			return data;
		},

		/**
		 * Saves the working set in the data server
		 * 
		 * @param data
		 *            The object with the FloorMap data set
		 * @param identifier
		 *            The FloorMap object identifier
		 * @param success
		 *            A success callback function
		 * @param failure
		 *            An error callback function
		 */
		save: function(data, identifier, success, failure) {

			url = 'http://api.allshoppings.mobi/bdb/dashboard/floormapData';

			data.identifier = identifier;
			for( var i = 0; i < data.data.length; i++ ) {
				var element = data.data[i];
				element.x = indoormap.extractNumber($('#' + element.uid).css('left'));
				element.y = indoormap.extractNumber($('#' + element.uid).css('top'));
				element.zoneName = $('#zoneName-' + element.uid).val();
				data.data[i] = element;
			}

			$.ajax({
				headers: {"Content-Type":"application/json; charset=UTF-8"},
				crossDomain : true,
				dataType : "json",
				type : 'POST',
				url : url,
				data : JSON.stringify(data),
				success : function(data) {
					alert('Datos Guardados');
					if( typeof(success) == 'function') success();
				},
				error : function() {
					alert('Error al guardar los datos. Intente de nuevo');
					if( typeof(failure) == 'function') failure();
				}
			});
		},

		/**
		 * The information obtained with a tablet is generally recorded with a
		 * different map resolution and size than the map we are showing. This
		 * function converts the points x and y coordinates according to the
		 * final map resolution
		 * 
		 * @param data
		 *            A FloorMap data set
		 * @returns The corrected FloorMap data set
		 */
		correct: function(data) {

			var sourceMapHeight = data.screenHeight - data.marginTop;
			var sourceMapWidth  = data.screenWidth;

			if( sourceMapHeight == 0 ) {
				sourceMapHeight = data.mapHeight;
				data.screenHeight = data.mapHeight;
				data.marginTop = 0;
			}
			if( sourceMapWidth  == 0 ) {
				sourceMapWidth = data.mapWidth;
				data.screenWidth = data.mapWidth;
			}
			
			for( var i = 0; i < data.data.length; i++ ) {
				var element = data.data[i];
				var y1 = (element.y - data.marginTop) * 100 / sourceMapHeight;
				var y2 = Math.floor(y1 * data.mapHeight / 100);
				var x1 = element.x * 100 / sourceMapWidth;
				var x2 = Math.floor(x1 * data.mapWidth / 100);

				element.y = y2;
				element.x = x2;

				data.data[i] = element;
			}

			data.corrected = true;
			return data;

		},

		/**
		 * Draws a heat map over the data points.
		 * 
		 * @param mapData
		 *            The FloorMap data set
		 * @param identifier
		 *            The FloorMap identifier
		 * @param canvas
		 *            An HTML canvas to work with
		 */
		drawHeatMap: function(baseUrl, token, mapData, identifier, canvas, entityId, fromDate, toDate, dayOfWeek, timezone, radius, max) {

			url = baseUrl + '/dashboard/heatmapData'
				+ '?authToken=' + token
				+ '&floormapId=' + identifier
				+ '&timezone=' + timezone 
				+ '&dayOfWeek=' + dayOfWeek
				+ '&fromStringDate=' + fromDate 
				+ '&toStringDate=' + toDate;
				
			if (radius === undefined) radius = 150;
			if (max === undefined ) max = 4;

			$.getJSON(url, function(data) {

				var heatmap = h337.create({
					container: canvas,
					radius: radius,
					maxOpacity: 0.9,
					minOpacity: 0,
					blur: .75				
				});

				heatData = [];
				
				for(var i = 0; i < data.data.length; i++) {
					var ele = data.data[i];
					heatData.push(indoormap.prepareHeatElement(ele[0], ele[1]));
				}
				
				heatmap.setData({
					max: max,
					data: heatData
				});
			});

		},

		/**
		 * Tryes to find a WifiSpot with a specific ID
		 */
		findWifiSpot: function(id) {
			for( var i = 0; i < wifiSpots.length; i++ ) {
				if( wifiSpots[i].identifier == id )
					return wifiSpots[i];
			}

			return null;
		},

		createContext: function(width, height) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			return canvas.getContext("2d");
		},

		toggleMap: function() {
			if( mapActive == 1 ) 
				mapActive = 0;
			else
				mapActive = 1;

			indoormap.drawLineElement(trackIndex);
		},

		/**
		 * Draw path and journey lines in a map
		 */
		drawLines: function(baseUrl, token, mapData, identifier, canvasId, entityId, fromDate, toDate, dayOfWeek, timezone, fromRange, toRange) {

			url = baseUrl + '/dashboard/floormapJourneyData'
				+ '?authToken=' + token
				+ '&floormapId=' + identifier
				+ '&timezone=' + timezone 
				+ '&dayOfWeek=' + dayOfWeek
				+ '&fromStringDate=' + fromDate 
				+ '&toStringDate=' + toDate;
				+ '&fromRange=' + fromRange;
				+ '&toRange=' + toRange;
				
			$.getJSON(url, function(data) {

				trackCache = data.data;
				trackIndex = 0;
				indoormap.drawLineElement(0);

			});

		},

		drawNextLineElement: function() {
			trackIndex++;
			if( trackIndex >= trackCache.length )
				trackIndex = 0;
			indoormap.drawLineElement(trackIndex);
		},

		drawPrevLineElement: function() {
			trackIndex--;
			if( trackIndex < 0 )
				trackIndex = trackCache.length-1;
			indoormap.drawLineElement(trackIndex);
		},


		getKey: function(arr, ele) {
			for(var i = 0; i < arr.length; i++)
				if( arr[i] == ele)
					return i;

			arr.push(ele);
			return arr.length-1;
		},

		drawLineElement: function(index) {
			var correction = 4;

			try {
				var el = $('.heatmap-canvas')[0];
				el.parentNode.removeChild(el)
			} catch( e ) {}

			if( mapActive == 1 ) {
				var heatmap = h337.create({
					container: $('.mapContainer')[0],
					radius: 300,
					maxOpacity: 0.9,
					minOpacity: 0,
					blur: .75				
				});

				heatData = [];
				
				var data = Array();
				var dataVals = Array();
				var heatData = Array();
				var max = 0;
				var ele = trackCache[index];
				var timeslots = Object.keys(ele.wifiPoints);
				for( var j = 0; j < timeslots.length; j++ ) {
					var spot = indoormap.findWifiSpot(ele.wifiPoints[timeslots[j]]);
					var key = indoormap.getKey(data, spot);
					if( dataVals[key] == undefined )
						dataVals[key] = 1;
					else
						dataVals[key]++;
					if( dataVals[key] > max )
						max = dataVals[key];
				}

				for(var i = 0; i < data.length; i++) {
					var ele = data[i];
					var val = dataVals[i];
					heatData.push(indoormap.prepareHeatElement(ele.identifier, val));
				}
				
				heatmap.setData({
					max: max,
					data: heatData
				});
				heatmap.repaint();
			}

			var canvas = document.getElementById('map');
			var jqCanvas = $('#map');
			canvas.width = parseInt(jqCanvas.css('width'));
			canvas.height = parseInt(jqCanvas.css('height'));
			var context = canvas.getContext("2d");
			var ele = trackCache[index];
			var timeslots = Object.keys(ele.wifiPoints);
			for( var j = 0; j < timeslots.length; j++ ) {
				var spot = indoormap.findWifiSpot(ele.wifiPoints[timeslots[j]]);
				if( j == 0 ) {
					context.beginPath();
					context.moveTo(spot.x +correction, spot.y +correction);
				} else {
					context.lineTo(spot.x +correction, spot.y +correction);
				}
			}
		    context.lineWidth = 10;
		    context.strokeStyle = '#0000ff';
		    context.lineCap = 'round';
		    context.lineJoin = 'round';
		    context.stroke();

		},

		/**
		 * Takes data from a WifiSpot position to prepare a Heat Map element
		 * 
		 * @param id
		 *            The WifiSpot object identifier
		 * @param percentage
		 *            the percentage value received from the heat map data
		 *            service
		 * @returns A heat map element, composed by x, y, and value
		 */
		prepareHeatElement: function(id, percentage) {
			var srcPoint = $('#' + id);
			obj = {
					x: Math.floor(indoormap.extractNumber(srcPoint.css('left')) + (indoormap.extractNumber(srcPoint.css('width'))  / 2)),
					y: Math.floor(indoormap.extractNumber(srcPoint.css('top'))  + (indoormap.extractNumber(srcPoint.css('height')) / 2)),
					value: Math.ceil(percentage)
			};
			
			return obj;
		},

		/**
		 * Draws the WifiSpot elements in the map container
		 * 
		 * @param data
		 *            The FloorMap data set that contains the WifiSpot elements
		 *            inside
		 * @param container
		 *            Where to draw the WifiSpot element
		 */
		draw: function(data, container) {

			wifiSpots = data.data;

			for( var i = 0; i < data.data.length; i++ ) {
				var element = data.data[i];
				indoormap.addLocation(element.uid, element.x, element.y, container, element.apDevice);
			}

		},

		/**
		 * Adds an individual WifiSpot on the div map container
		 * 
		 * @param id
		 *            WifiSpot Identifier
		 * @param x
		 *            x coordinate
		 * @param y
		 *            y coordinate
		 * @param div
		 *            Where to show the spot
		 */
		addLocation: function(id, x, y, div, apDevice) {
			var img = new Image();
			img.id = id;
			if( apDevice === undefined )
				img.src = 'styles/img/bullet.gif';
			else 
				img.src = 'styles/img/bullet-blue.gif';
			div.appendChild(img);
			$('#' + id).addClass('draggable');
			$('#' + id).css('left', x + 'px');
			$('#' + id).css('top', y + 'px');
			$('#' + id).mouseover(function() {
				console.log(apDevice);
			})
		},

		/**
		 * Simple parser to convert a string to a number without the risk of
		 * receiving a NaN
		 * 
		 * @param value
		 *            The value to parse
		 * @returns a valid number, never a NaN
		 */
		extractNumber: function(value) {
			var n = parseInt(value);
			return n == null || isNaN(n) ? 0 : n;
		},

};

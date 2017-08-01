/**
 * InfluenceMapCtrl - controller
 */
function InfluenceMapCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

	var vm = this;
	var lat =0;
	var lon = 0;

	$scope.TYPE_GPS_WORK = 3;
	$scope.TYPE_GPS_HOME = 2;
	$scope.TYPE_GPS_WORK_PEASANT = 5;
	$scope.TYPE_GPS_HOME_PEASANT = 4;
	$scope.TYPE_GPS_WORK_ORIGIN_DESTINY = 7;
	$scope.TYPE_GPS_HOME_ORIGIN_DESTINY = 6;
	$scope.TYPE_GPS = 1;
	$scope.TYPE_WIFI = 0;

	$scope.brands = null;
	$scope.brand = null;
	$scope.stores = null;
	$scope.store = null;
    $scope.storeLabel = '';

	$scope.init = function() {

		$scope.checkGpsWork = true;
		$scope.checkGpsHome = true;
		$scope.checkPeasantWork = true;
		$scope.checkPeasantHome = true;
		$scope.checkOriginWork = true;
		$scope.checkDestinyWork = true;
		$scope.checkOriginHome = true;
		$scope.checkDestinyHome = true;


		$scope.brands = new Array();
		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
			.then($scope.postInit);

	}

	$scope.postInit = function(data) {

		// validate token
		if( data.status != 200 || data.data.error_code !== undefined )
			AuthenticationService.logout(function(response) {
				$location.path('/login');
			});

		for( var i = 0; i < data.data.data.length; i++ ) {
			var brand = {
				id: data.data.data[i].identifier,
				name: data.data.data[i].name
			}
			$scope.brands.push(brand);
		}
		$scope.brand = $scope.brands[0];
		$scope.brandChange();

	}

    $scope.updateStoreLabel = function() {
        $http.get(CommonsService.getUrl('/dashboard/config')
            + '&entityId=' + $scope.brand.id
            + '&entityKind=1')
            .then($scope.postUpdateStoreLabel);
    }

    $scope.postUpdateStoreLabel = function(data) {
        try {
            $scope.storeLabel = data.data.storeLabel;
            if( $scope.storeLabel === undefined || $scope.storeLabel == null )
                $scope.storeLabel = 'Tienda';
        } catch( e ) {
            $scope.storeLabel = 'Tienda';
        }
    }

	$scope.brandChange = function() {

		$scope.updateStoreLabel();
		$scope.stores = new Array();
		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
			+ '&entityId=' + $scope.brand.id
			+ '&entityKind=1&onlyExternalIds=true')
			.then($scope.postBrandChange);
	}

	$scope.postBrandChange = function(data) {

		for( var i = 0; i < data.data.data.length; i++ ) {
			var store = {
				id: data.data.data[i].identifier,
				name: data.data.data[i].name
			}
			$scope.stores.push(store);
		}
		$scope.store = $scope.stores[0];
		$scope.loadingRefresh = false;

		$scope.refresh();

	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/store/' + $scope.store.id ))
			.then($scope.postRefresh);

	}

	$scope.postRefresh = function(data) {

		// Default fallback for Mexico City
		if( data.data === undefined
			|| data.data.address === undefined
			|| data.data.address.latitude === undefined ) {
			data.data = {
				address: {
					latitude: 19.412457,
					longitude: -99.1404902
				}
			}
		}

		lat = data.data.address.latitude;
		lon = data.data.address.longitude;

		map = new GMaps({
			div: '#map',
			lat: data.data.address.latitude,
			lng: data.data.address.longitude,
			width: "100%",
			height: "550px",
			zoom: 11
		});

		map.removeMarkers();
		var marker = new google.maps.Marker({
			position: {lat: data.data.address.latitude, lng: data.data.address.longitude},
			map: map.map,
			title: $scope.store.name
		});

		$http.get(CommonsService.getUrl('/dashboard/externalGeoData')
			+ '&entityId=' + $scope.store.id
			+ '&entityKind=3')
			.then($scope.fillMap);
	}

	$scope.fillMap = function(data) {

		var obj = data.data.data;
		for (i = 0; i < obj.length; i++) {
			var item = obj[i];

			if( item.type == $scope.TYPE_GPS_WORK && $scope.checkGpsWork == true ) {
				var conns = item.connections / 20;
				if( conns > 2000 ) conns = 2000;
				if( conns < 100 ) conns = 100;
				map.drawCircle({
					lat: item.lat,
					lng: item.lon,
					fillColor: '#00ff00',
					fillOpacity: 0.2,
					strokeColor: '#00ff00',
					strokeWeight: 1,
					radius: conns
				});
			}

			if( item.type == $scope.TYPE_GPS_HOME && $scope.checkGpsHome == true ) {
				var conns = item.connections / 5;
				if( conns > 2000 ) conns = 2000;
				if( conns < 100 ) conns = 100;
				map.drawCircle({
					lat: item.lat,
					lng: item.lon,
					fillColor: '#0000ff',
					fillOpacity: 0.2,
					strokeColor: '#0000ff',
					strokeWeight: 1,
					radius: conns
				});
			}

			if( item.type == $scope.TYPE_GPS_WORK_PEASANT && $scope.checkPeasantWork == true  ) {
				var conns = item.connections / 20;
				if( conns > 2000 ) conns = 2000;
				if( conns < 100 ) conns = 100;
				map.drawCircle({
					lat: item.lat,
					lng: item.lon,
					fillColor: '#800080',
					fillOpacity: 0.2,
					strokeColor: '#800080',
					strokeWeight: 1,
					radius: conns
				});
			}

			if( item.type == $scope.TYPE_GPS_HOME_PEASANT && $scope.checkPeasantHome == true  ) {
				var conns = item.connections / 5;
				if( conns > 2000 ) conns = 2000;
				if( conns < 100 ) conns = 100;
				map.drawCircle({
					lat: item.lat,
					lng: item.lon,
					fillColor: '#FFA500',
					fillOpacity: 0.2,
					strokeColor: '#FFA500',
					strokeWeight: 1,
					radius: conns
				});
			}
		}//end for

		if( $scope.checkOriginWork == true  ) {

			var result = getOriginWork(lat, lon, map);

		}

		if( $scope.checkDestinyWork == true  ) {

			var result = getDestinyWork(lat, lon, map);

		}

		if( $scope.checkOriginHome == true  ) {
			var result = getOriginHome(lat, lon, map);

		}

		if( $scope.checkDestinyHome == true  ) {
		  var result = getDestinyHome(lat, lon, map);
		}

		if( $scope.checkIsochroneWeekWorkTwenty == true  ) {
		  var result = getIsochrone(lat, lon, map, 20, '#ed5565');
		}
		if( $scope.checkIsochroneWeekWorkThirty == true  ) {
		  var result = getIsochrone(lat, lon, map, 30, '#32CD32');
		}
		if( $scope.checkIsochroneWeekWorkFourty == true  ) {
		  var result = getIsochrone(lat, lon, map, 40, '#CFB53B');
		}

		if ($scope.store.name == "Sportium Arboledas") {
			var image = "/styles/img/sneakers.png";
			var marker = new google.maps.Marker({
				position: {lat: 19.526770, lng: -99.228340},
				map: map.map,
				title: 'Sport City Mundo E',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.502331, lng: -99.176716},
				map: map.map,
				title: 'Sport City Tecnoparque',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.487852, lng: -99.239875},
				map: map.map,
				title: 'Sport City Lomas Verdes',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.558743, lng: -99.218218},
				map: map.map,
				title: 'SmartFit Jinetes',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.548406, lng: -99.206343},
				map: map.map,
				title: 'SmartFit Gustavo Baz',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.507134, lng: -99.236758},
				map: map.map,
				title: 'SmartFit Satelite',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.502522, lng: -99.203320},
				map: map.map,
				title: 'Go Fitness El Rosario',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.575284, lng: -99.226269},
				map: map.map,
				title: 'Nelson Vargas Mayorazgos',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.511977, lng: -99.242451},
				map: map.map,
				title: 'Nelson Vargas Satelite',
				icon: image
			});
		}

		if( $scope.store.name == "Sportium San Angel" ){
			var image = "https://ufs.cloud.getin.mx:8773/services/objectstorage/luis/sneakers.png";
			var marker = new google.maps.Marker({
				position: {lat: 19.370794, lng: -99.163294},
				map: map.map,
				title: 'Sport City Universidad',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.345971, lng: -99.177325},
				map: map.map,
				title: 'Sport City Oasis',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.363605, lng: -99.182711},
				map: map.map,
				title: 'Sport City Insurgentes',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.339813, lng: -99.194032},
				map: map.map,
				title: 'Sport City Loreto',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.307144, lng: -99.165783},
				map: map.map,
				title: 'Sport City Gran Sur',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.337143, lng: -99.198685},
				map: map.map,
				title: 'Sports World Loreto',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.345566, lng: -99.178429},
				map: map.map,
				title: 'Sports World Miguel Angel de Quevedo',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.353178, lng: -99.186669},
				map: map.map,
				title: 'Sports World San Angel',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.370993, lng: -99.179631},
				map: map.map,
				title: 'Sports World Del Valle',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.364900, lng: -99.171198},
				map: map.map,
				title: 'Sports World Amores',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.347434, lng: -99.201362},
				map: map.map,
				title: 'Sports World Altavista',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.365835, lng: -99.167305},
				map: map.map,
				title: 'Sports World Universidad',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.372702, lng: -99.173007},
				map: map.map,
				title: 'Sports World Felix Cuevas',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.351690, lng: -99.185820},
				map: map.map,
				title: 'Energy Fitness Altavista',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.395075, lng: -99.175296},
				map: map.map,
				title: 'Energy Fitness WTC',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.349393, lng: -99.188997},
				map: map.map,
				title: 'Zona Fitness Altavista',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.335787, lng: -99.157777},
				map: map.map,
				title: 'Smartfit Los Reyes',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.335665, lng: -99.198589},
				map: map.map,
				title: 'Smartfit Escenaria',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.330178, lng: -99.216389},
				map: map.map,
				title: 'Smartfit San Jeronimo',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.361288, lng: -99.183253},
				map: map.map,
				title: 'Smartfit Torre Diamante',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.372572, lng: -99.169356},
				map: map.map,
				title: 'SmartFit Amores',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.349069, lng: -99.190843},
				map: map.map,
				title: 'Go Fitness Revolución',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.379264, lng: -99.169450},
				map: map.map,
				title: 'Go Fitness Coyoacan',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.338376, lng: -99.159184},
				map: map.map,
				title: 'Nelson Vargas Los Reyes',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.323683, lng: -99.236649},
				map: map.map,
				title: 'Nelson Vargas San Jeronimo',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.365353, lng: -99.160268},
				map: map.map,
				title: 'Nelson Vargas Del Valle',
				icon: image
			});
			var marker = new google.maps.Marker({
				position: {lat: 19.368520, lng: -99.173798},
				map: map.map,
				title: 'C+ Adolfo Prieto',
				icon: image
			});
		}

		$scope.loadingRefresh = false;

	}

	return vm;
};

angular
	.module('bdb')
	.controller('InfluenceMapCtrl', InfluenceMapCtrl);

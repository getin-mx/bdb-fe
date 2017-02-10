/**
 * InfluenceMapCtrl - controller
 */
function InfluenceMapCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

	var vm = this;

	$scope.TYPE_GPS_WORK = 3;
	$scope.TYPE_GPS_HOME = 2;
	$scope.TYPE_GPS_WORK_PEASANT = 5;
	$scope.TYPE_GPS_HOME_PEASANT = 4;
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
			map: map.map
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
					fillOpacity: 0.8,
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
					fillOpacity: 0.8,
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
					fillOpacity: 0.8,
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
					fillOpacity: 0.8,
					strokeColor: '#FFA500',
					strokeWeight: 1,
					radius: conns
				});
			}

		}

		$scope.loadingRefresh = false;

	}

	return vm;
};

angular
	.module('bdb')
	.controller('InfluenceMapCtrl', InfluenceMapCtrl);

/**
 * APLocationCtrl - controller
 */
function APLocationCtrl($scope, $stateParams, $location, $http, CommonsService, AuthenticationService) {

	var vm = this;

    $scope.init = function() {
    	if( $stateParams.hostname !== undefined ) {
    		$scope.hostname = $stateParams.hostname;
    	} else {
    		$scope.hostname = document.getElementById('hostnameParam').value;
    	}
    	$scope.refresh();
    }

	$scope.refresh = function() {
		$http.get(CommonsService.getUrl('/apdevice/' + $scope.hostname ))
			.then($scope.postRefresh);
	}

	$scope.postRefresh = function(data) {

		// Default fallback for Mexico City
		if(  data.data.lat === undefined ) {
			data.data.lat = 19.412457;
			data.data.lon = -99.1404902;
		}

		map = new GMaps({
			div: '#map',
			lat: data.data.lat,
			lng: data.data.lon,
			width: "100%",
			height: "550px",
			zoom: 14
		});

		map.removeMarkers();
		map.addMarker({
			lat: data.data.lat,
			lng: data.data.lon,
			title: data.data.hostname
		});
	}

	return vm;

};

angular
	.module('bdb')
	.controller('APLocationCtrl', APLocationCtrl);
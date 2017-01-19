/**
 * ShoppingSettingsCtrl - controller
 */
 function ShoppingSettingsCtrl($rootScope, $scope, $http, $stateParams, $location, CommonsService, AuthenticationService, SweetAlert, $timeout, $filter) {

	var vm = this;

	$scope.obj = {
		identifier: null,
		avatarId: 'default.png',
		status: 0,
		timezone: -3,
		fenceSize: 2000,
		checkinAreaSize: 200,
		name: 'Nuevo Centro Comercial',
		address: {
			country: 'Mexico'
		}
	}

	$scope.timezones = CommonsService.getTimezoneArray();
	$scope.timezone = null;
	$scope.countries = new Array();
	$scope.country = null;

	$scope.init = function() {
		if( $stateParams.identifier !== undefined ) {
			$scope.identifier = $stateParams.identifier;
		} else {
			$scope.identifier = document.getElementById('identifierParam').value;
		}
		$http.get(CommonsService.getUrl('/countries'))
			.then($scope.postInit);
	}

	$scope.postInit = function(data) {
	    for( var i = 0; i < data.data.data.length; i++ ) {
	    	var country = {
	    		id: data.data.data[i].identifier,
	    		name: data.data.data[i].name
	    	}
	    	$scope.countries.push(country);
	    }
	    $scope.country = $scope.countries[1];
		$scope.refresh();
	}

	$scope.refresh = function() {
		$http.get(CommonsService.getUrl('/shopping/' + $scope.identifier ))
		.then($scope.postRefresh);
	}

	$scope.postRefresh = function(data) {
		console.log(data);
		angular.extend($scope.obj, data.data);

		for( var i = 0; i < $scope.timezones.length; i++ ) {
			if( $scope.timezones[i].id == $scope.obj.timezone)
				$scope.timezone = $scope.timezones[i];
		}

		for( var i = 0; i < $scope.countries.length; i++ ) {
			if( $scope.countries[i].id == $scope.obj.address.country)
				$scope.country = $scope.countries[i];
		}
	}

	$scope.updateMap = function() {

		if($scope.map === undefined ) {
			// Default fallback for Mexico City
			if( $scope.obj.address.latitude === undefined ) {
				$scope.obj.address.latitude = 19.412457;
				$scope.obj.address.longitude = -99.1404902;
			}

			$scope.map = new GMaps({
				div: '#map',
				lat: $scope.obj.address.latitude,
				lng: $scope.obj.address.longitude,
				width: "100%",
				height: "450px",
				zoom: 14
			});

			$scope.map.removeMarkers();
			$scope.map.addMarker({
				lat: $scope.obj.address.latitude,
				lng: $scope.obj.address.longitude,
				title: $scope.obj.name
			});

		}
		
		$timeout(function() {$scope.map.refresh(); $scope.map.setCenter($scope.obj.address.latitude, $scope.obj.address.longitude);}, 500);
	}

	$scope.update = function() {
        $scope.loadingSubmit = true;

        $http.post(CommonsService.getUrl('/shopping/' + $scope.identifier), $scope.obj)
        .then($scope.postUpdate);

	}

    $scope.postUpdate = function(data) {
        if( data.status = 200 
            && data.data.error_code === undefined ) {
            SweetAlert.swal({
                title: "Ok!",
                text: "La configuración del centro comercial fue salvada con éxito",
                type: "success"
            });
        } else {
            SweetAlert.swal({
                title: "Error!",
                text: "La configuración del centro comercial no pudo salvarse",
                type: "error"
            });
        }

        $scope.loadingSubmit = false;
        $scope.postRefresh(data);
    }


	$scope.$on('ligboxgallery.delete', function(event, data) {
		var divId = data.parentNode.id;
		if( divId == 'avatarId') {
			$scope.obj.avatarId = 'default.png';
			CommonsService.safeApply($scope);
		}
	})

	$scope.$on('upload.success', function(event, data) {
		var file = data[0];
		var response = JSON.parse(data[1]);

		$scope.obj.avatarId = response.name;
		CommonsService.safeApply($scope);

	})

	return vm;
};

angular
	.module('bdb')
	.controller('ShoppingSettingsCtrl', ShoppingSettingsCtrl);

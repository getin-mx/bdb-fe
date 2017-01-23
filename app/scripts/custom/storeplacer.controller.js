/**
 * StorePlacerCtrl - controller
 */
function StorePlacerCtrl($scope, $http, $location, CommonsService, AuthenticationService, SweetAlert) {

	var vm = this;

	$scope.brands = null;
	$scope.brand = null;
	$scope.stores = null;
	$scope.store = null;

	$scope.obj = null;

	$scope.latitude = 0;
	$scope.longitude = 0;

	$scope.init = function() {

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

	$scope.brandChange = function() {

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
		if(  data.data.address.latitude === undefined ) {
			data.data.address.latitude = 19.412457;
			data.data.address.longitude = -99.1404902;
		}

		$scope.latitude = data.data.address.latitude;
		$scope.longitude = data.data.address.longitude;
		$scope.obj = data.data;

		map = new GMaps({
			div: '#map',
			lat: data.data.address.latitude,
			lng: data.data.address.longitude,
			width: "100%",
			height: "550px",
			zoom: 11
		});

		map.removeMarkers();
		map.addMarker({
			lat: data.data.address.latitude,
			lng: data.data.address.longitude,
			title: data.data.name,
			draggable : true,
			dragend : function(mouseevent) {
				$scope.latitude = this.getPosition().lat();
				$scope.longitude = this.getPosition().lng();
				$scope.$apply();
			}
		});

		$scope.loadingRefresh = false;

	}

	$scope.update = function() {
		$scope.loadingUpdate = true;

		$scope.obj.address.latitude = $scope.latitude;
		$scope.obj.address.longitude = $scope.longitude;

		$http.post(CommonsService.getUrl('/store'), $scope.obj)
			.then($scope.postUpdate);

	}

	$scope.postUpdate = function(data) {
		console.log(data);
		$scope.loadingUpdate = false;

		if( data.status = 200 
			&& data.data.error_code === undefined ) {
			SweetAlert.swal({
				title: "Ok!",
				text: "La configuración fue salvada con éxito",
				type: "success"
			});
		} else {
			SweetAlert.swal({
				title: "Error!",
				text: "La configuración no pudo salvarse",
				type: "error"
			});
		}

	}

	return vm;
};

angular
	.module('bdb')
	.controller('StorePlacerCtrl', StorePlacerCtrl);

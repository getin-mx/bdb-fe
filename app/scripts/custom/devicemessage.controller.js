/**
 * DeviceMessageCtrl - controller
 */
function DeviceMessageCtrl($scope, $http, $location, CommonsService, AuthenticationService, SweetAlert) {

	var vm = this;

	$scope.init = function() {

	}

	$scope.postInit = function(data) {


	}

	$scope.update = function() {
		$scope.loadingUpdate = true;

		$scope.obj = {
			deviceUUID: $scope.deviceUUID,
			title: $scope.title,
			message: $scope.message,
			url: $scope.url
		}

		$http.post(CommonsService.getDashUrl('/deviceMessage'), $scope.obj)
			.then($scope.postUpdate);

	}

	$scope.postUpdate = function(data) {
		console.log(data);
		$scope.loadingUpdate = false;

		if( data.status = 200 
			&& data.data.error_code === undefined ) {
			SweetAlert.swal({
				title: "Ok!",
				text: "Mensaje enviado con éxito",
				type: "success"
			});
		} else {
			SweetAlert.swal({
				title: "Error!",
				text: "No pudo enviarse el mensaje",
				type: "error"
			});
		}

	}

	return vm;
};

angular
	.module('bdb')
	.controller('DeviceMessageCtrl', DeviceMessageCtrl);

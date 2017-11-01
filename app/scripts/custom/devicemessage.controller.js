/**
 * DeviceMessageCtrl - controller
 */
function DeviceMessageCtrl($scope, $http, $location, CommonsService, AuthenticationService ) {

	var vm = this;

	$scope.types = null; 	
	$scope.type = null;

	$scope.typeDevice = 'hidden';
	$scope.typeUser = 'hidden';


	$scope.init = function() {

		$scope.types = Array();
		var type = null;
		type = {
			id: 'user',
			name: 'Por Usuario'
		}
		$scope.type = type;
		$scope.types.push(type);
		type = {
			id: 'device',
			name: 'Por Dispositivo'
		}
		$scope.types.push(type);
		type = {
			id: 'all',
			name: 'Masivo (Usar bajo tu propio riesgo)'
		}
		$scope.types.push(type);
		$scope.typeChange();
	}

	$scope.typeChange = function() {

		if( $scope.type.id === 'user') {
			$scope.typeUser = '';
			$scope.typeDevice = 'hidden';
		} else if( $scope.type.id === 'device') {
			$scope.typeUser = 'hidden';
			$scope.typeDevice = '';
		} else {
			$scope.typeUser = 'hidden';
			$scope.typeDevice = 'hidden';
		}

	}

	$scope.update = function() {
		$scope.loadingUpdate = true;

		if( $scope.type.id === 'user') {
			$scope.obj = {
				userId: $scope.userId,
				title: $scope.title,
				message: $scope.message,
				url: $scope.url
			}
		} else if( $scope.type.id === 'device') {
			$scope.obj = {
				deviceUUID: $scope.deviceUUID,
				title: $scope.title,
				message: $scope.message,
				url: $scope.url
			}
		} else {
			$scope.obj = {
				title: $scope.title,
				message: $scope.message,
				url: $scope.url
			}
		}

		$http.post(CommonsService.getDashUrl('/deviceMessage'), $scope.obj)
			.then($scope.postUpdate);

	}

	$scope.postUpdate = function(data) {
		console.log(data);
		$scope.loadingUpdate = false;

		if( data.status = 200 
			&& data.data.error_code === undefined ) {
			swal({
				title: "Ok!",
				text: "Mensaje enviado con éxito",
				type: "success"
			});
		} else {
			swal({
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

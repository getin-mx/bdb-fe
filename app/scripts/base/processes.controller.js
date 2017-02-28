/**
 * ProcessesCtrl - controller
 */
 function ProcessesCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

 	var vm = this;

 	var STATUS_ENABLED = 0;
 	var STATUS_DISABLED = 1;
 	var STATUS_PENDING = 2;

 	var STATUS_NEW = 3;
 	var STATUS_VIEWED = 4;
 	var STATUS_REMOVED = 5;

 	var STATUS_PREPARED = 10;
 	var STATUS_RUNNING = 11;
 	var STATUS_SUCCEEDED = 12;
 	var STATUS_ERROR = 13;
 	var STATUS_CANCELLED = 14;

 	$scope.search = '';
 	$scope.status = [{},{}];


 	$scope.init = function() {
 		$scope.loadingRefresh = true;
 		$scope.refresh();
 	}

 	$scope.clean = function() {

 		$scope.search = ''
 		$scope.refresh();

 	}

 	$scope.refresh = function() {

 		$scope.loadingRefresh = true;
 		$http.get(CommonsService.getUrl('/process') 
 			+ '&order=startDateTime&from=0&to=10&status=11'
 			+ '&q=' + encodeURIComponent($scope.search))
 		.then($scope.fillTableActive);
 		$http.get(CommonsService.getUrl('/process') 
 			+ '&order=startDateTime&from=0&to=10&status=10,12,13,14'
 			+ '&q=' + encodeURIComponent($scope.search))
 		.then($scope.fillTableInactive);

 	}

 	$scope.fillRecord = function(obj, status) {
 		var newRow = '<tr>'
 		+ '<td data-value="' + obj.name + '">' + obj.name + '</td>'
 		+ '<td data-value="' + obj.userId + '">' + obj.userId + '</td>'
 		+ '<td data-value="' + (obj.startDateTime === undefined ? '' : obj.startDateTime) 
 		+ '">' + (obj.startDateTime === undefined ? '-' :  obj.startDateTime) + '</td>'
 		+ '<td data-value="' + (obj.endDateTime === undefined ? '' : obj.endDateTime) 
 		+ '">' + (obj.endDateTime === undefined ? '-' :  obj.endDateTime) + '</td>'
 		+ '<td data-value="' + obj.status + '">' + $scope.statusToString(obj.status) + '</td>'

		+ '<td data-value="' + obj.identifier + '">' 
							 + '</td>'

 		+ '</tr>';

		return newRow;
	}

	$scope.statusTranslator = function(status) {
		if(status == 11) {
			return 0;
		} else {
			return 1;
		}
	}


	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'process', data, '11');
	}

	$scope.fillTableInactive = function(data) {
		CommonsService.paginateCommonTable($scope, 'process', data, '10,12,13,14');
	}

	$scope.statusToString = function(status) {
		if( status == STATUS_RUNNING ) 
			return "Ejecutando...";
		if( status == STATUS_PREPARED)
			return "Preparado";
		if( status == STATUS_CANCELLED)
			return "Cancelado";
		if( status == STATUS_ERROR)
			return "Error";
		if( status == STATUS_SUCCEEDED)
			return "Finalizado";
		if( status == STATUS_REMOVED)
			return "Eliminado";
		if( status == STATUS_VIEWED)
			return "Visto";
		if( status == STATUS_NEW)
			return "Nuevo";
		if( status == STATUS_PENDING)
			return "Pendiente";
		if( status == STATUS_DISABLED)
			return "Deshabilitado";
		if( status == STATUS_ENABLED)
			return "Habilitado";
		return "";
	}

	return vm;

};

angular
	.module('bdb')
	.controller('ProcessesCtrl', ProcessesCtrl);
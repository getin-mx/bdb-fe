/**
 * BigDataBrain
 *
 */

function CommonsService($http, $cookieStore, $rootScope) {

	var vm = this;
	this.getUrl = function(service) {
		if( $rootScope.globals.currentUser ) {
			return config.baseUrl + service + '?authToken=' + $rootScope.globals.currentUser.token;
		} else {
			return config.baseUrl + service;
		}
	}

	this.getDashUrl = function(service) {
		if( $rootScope.globals.currentUser ) {
			return config.dashUrl + service + '?authToken=' + $rootScope.globals.currentUser.token;
		} else {
			return config.dashUrl + service;
		}
	}

	this.paginateCommonTable = function($scope, entity, data, status, role ) {
		var strStatus;
		var fnStatus;
		var idxStatus = ($scope.statusTranslator !== undefined ) ? $scope.statusTranslator(status) : status

		if( idxStatus == 0 ) {
			strStatus = 'active';
			fnStatus = $scope.fillTableActive;
		} else {
			strStatus = 'inactive';
			fnStatus = $scope.fillTableInactive; 
		}

		//get the footable object
		var table = $('#' + entity + '-' + strStatus + '-table').data('footable');

		$('#' + entity + '-' + strStatus + '-table').data('record-count',data.data.recordCount);
		table.pageCallback = function(ft, pageNumber, sort, callback) {
			console.log(sort);
			var $table = $(ft.table), data = $table.data();
			var pageSize = data.pageSize || ft.options.pageSize;
			var from = pageSize * pageNumber;
			var to = from + pageSize;

			$scope.loadingRefresh = true;
			$scope.status[idxStatus].httpCallback = callback;
			$scope.status[idxStatus].ft = ft;
			$scope.status[idxStatus].pageNumber = pageNumber;

			$http.get(vm.getUrl('/' + entity) 
				+ '&from=' + from 
				+ '&to=' + to 
				+ '&status=' + status
				+ (role === undefined ? '' : '&role=' + role)
				+ ($scope.country === undefined ? '' : '&country=' + $scope.country.id)
				+ '&q=' + encodeURIComponent($scope.search)
				+ '&order=' + encodeURIComponent(sort))
				.then(fnStatus);
		}

	    $('#' + entity + '-' + strStatus + '-table>tbody>tr').each(function(index, elem){$(elem).remove();});

	    var newRow = '';
	    for(var i = 0; i < data.data.data.length; i++) {
	    	var obj = data.data.data[i];
	    	newRow += $scope.fillRecord(obj, status);
	    }

		table.appendRow(newRow);

    	$('#' + entity + '-' + strStatus + '-count').html('&nbsp;(' + data.data.recordCount + ')');

	    if( $scope.status[idxStatus].httpCallback !== undefined ) {
	    	$scope.status[idxStatus].ft.pageInfo.currentPage = $scope.status[idxStatus].pageNumber;
	    	$scope.status[idxStatus].httpCallback($scope.status[idxStatus].ft, $scope.status[idxStatus].pageNumber);
	    	$scope.status[idxStatus].httpCallback = undefined;
	    	$scope.status[idxStatus].ft = undefined;
	    	$scope.status[idxStatus].pageNumber = undefined;
	    }

		$scope.loadingRefresh = false;
	}

	return this;
};

angular
	.module('bdb')
	.factory('CommonsService', CommonsService);

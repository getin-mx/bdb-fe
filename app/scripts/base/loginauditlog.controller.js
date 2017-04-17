/**
 * LoginAuditLogCtrl - controller
 */
function LoginAuditLogCtrl($scope, $http, $location, $stateParams, CommonsService, AuthenticationService) {

	var vm = this;
	$scope.search = '';
	$scope.country = {id: null};
	$scope.status = [{},{}];
	$scope.userId = '';

	$scope.init = function() {
        if( $stateParams.identifier !== undefined ) {
            $scope.userId = $stateParams.identifier;
        } else {
            $scope.userId = document.getElementById('identifierParam').value;
        }

		$scope.refresh();
	}

	$scope.clean = function() {

		$scope.search = ''
		$scope.refresh();

	}

	$scope.statusTranslator = function(txt) {
		return 0;
	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/auditlog') 
			+ '&order=key&from=0&to=10&status=0&eventType=0&userId=' + encodeURIComponent($scope.userId)
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTable);
	}

	$scope.fillRecord = function(obj, status) {
		var row = '<tr>'
	    		+ '<td data-value="' + obj.userId + '">' + obj.userId + '</td>'
	    		+ '<td data-value="' 
	    					  + '">' + 'Login' + '</td>'
	    		+ '<td data-value="' + (obj.eventDate === undefined ? '' : obj.eventDate) 
	    					  + '">' + (obj.eventDate === undefined ? '-' : obj.eventDate) + '</td>'
	    		+ '</tr>';
	    return row;
	}

	$scope.fillTable = function(data) {

		var assignedCount = 0;

		//get the footable object
		var tableAssigned = $('#auditlog-table').data('footable');
		tableAssigned.pageCallback = function(ft, pageNumber, sort, callback) {
			var $table = $(ft.table), data = $table.data();
			var pageSize = data.pageSize || ft.options.pageSize;
			var from = pageSize * pageNumber;
			var to = from + pageSize;

			$scope.loadingRefresh = true;
			$scope.status.httpCallback = callback;
			$scope.status.ft = ft;
			$scope.status.pageNumber = pageNumber;

			$http.get(CommonsService.getUrl('/auditlog')  
				+ '&from=' + from 
				+ '&to=' + to 
				+ '&eventType=0'
				+ '&userId=' + encodeURIComponent($scope.userId))
				.then($scope.fillTable);
		}

	    $("#auditlog-table>tbody>tr").each(function(index, elem){$(elem).remove();});

	    tableAssignedRows = '';

	    for(var i = 0; i < data.data.data.length; i++) {
	    	var obj = data.data.data[i];
	    	var newRow = $scope.fillRecord(obj, null);
    		tableAssignedRows += newRow;
    		assignedCount++;
	    }

	    tableAssigned.appendRow(tableAssignedRows);

		$('#auditlog-table').data('current-page', '0');
		$('#auditlog-table').data('record-count', data.data.recordCount);

		tableAssigned.redraw();

    	$("#auditlog-count").html('&nbsp;(' + data.data.recordCount + ')');

	    if( $scope.status.httpCallback !== undefined ) {
	    	$scope.status.ft.pageInfo.currentPage = $scope.status.pageNumber;
	    	$scope.status.httpCallback($scope.status.ft, $scope.status.pageNumber);
	    	$scope.status.httpCallback = undefined;
	    	$scope.status.ft = undefined;
	    	$scope.status.pageNumber = undefined;
	    }

		$scope.loadingRefresh = false;

	}

	return vm;

};

angular
    .module('bdb')
    .controller('LoginAuditLogCtrl', LoginAuditLogCtrl);
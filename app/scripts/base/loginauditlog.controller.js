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
			.then($scope.fillTableActive);
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

	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'auditlog', data, 0, null);
	}

	return vm;

};

angular
    .module('bdb')
    .controller('LoginAuditLogCtrl', LoginAuditLogCtrl);
/**
 * UsersCtrl - controller
 */
function UsersCtrl($scope, $http, $location, CommonsService, AuthenticationService, $uibModal) {

	var vm = this;
	$scope.search = '';
	$scope.country = {id: null};
	$scope.status = [{},{}];


	$scope.init = function() {
		$scope.refresh();
	}

	$scope.clean = function() {

		$scope.search = ''
		$scope.refresh();

	}

	$scope.statusTranslator = function(txt) {
		if(txt === '7') return 0;
		if(txt === '1,3,5') return 1;
	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/user') 
			+ '&order=key&from=0&to=10&status=7&role=1,3,5,7,9,11,13,15'
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableActive);
		$http.get(CommonsService.getUrl('/user') 
			+ '&order=key&from=0&to=10&status=1,3,5&role=1,3,5,7,9,11,13,15'
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableInactive);

	}

	$scope.modalAuditLog = function(identifier) {
		document.getElementById('identifierParam').value = identifier;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/base/loginauditlog.html',
            size: 'lg',
            controller: LoginAuditLogCtrl
        });
	}

	$scope.fillRecord = function(obj, status) {
		var row = '<tr>'
	    		+ '<td data-value="' + obj.identifier + '">' + obj.identifier + '</td>'
	    		+ '<td data-value="' + (obj.fullname === undefined ? '' : obj.fullname) 
	    					  + '">' + (obj.fullname === undefined ? '-' : obj.fullname) + '</td>'
	    		+ '<td data-value="' + (obj.securitySettings.role === undefined ? '' : obj.securitySettings.role) 
	    					  + '">' + (obj.securitySettings.role === undefined ? '-' : $scope.getUserType(obj.securitySettings.role)) + '</td>'
	    		+ '<td data-value="' + (obj.lastLogin === undefined ? '' : obj.lastLogin) 
	    					  + '">' + (obj.lastLogin === undefined ? '-' : obj.lastLogin) + '</td>'
	    		+ '<td data-value="' + obj.hotname + '">'
	    			   + '<a class="loginauditlog" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.identifier + '"><i class="fa fa-search-plus"></i></a>'
	    		+ '</td>'
	    		+ '</tr>';
	    return row;
	}

	$scope.getUserType = function(role) {
		if( role == 0 ) return "Usuario";
		if( role == 1 ) return "Administrador";
		if( role == 3 ) return "Country Admin";
		if( role == 5 ) return "Centro Comercial";
		if( role == 7 ) return "Cadena";
		if( role == 9 ) return "Tienda";
		if( role == 11 ) return "Data Entry";
		if( role == 13 ) return "Solo Lectura";
		if( role == 15 ) return "Adminstrador de Cupones";
		if( role == 17 ) return "Aplicacion";
	}

	$scope.defineTriggers = function() {
		// Define auditlog click response
		$('.loginauditlog').click(function(e) {
			e.preventDefault();
			$scope.modalAuditLog($(e.currentTarget).data('value'));
		})
	}

	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'user', data, '7', '1,3,5,7,9,11,13,15');
		$scope.defineTriggers();
	}

	$scope.fillTableInactive = function(data) {
		CommonsService.paginateCommonTable($scope, 'user', data, '1,3,5', '1,3,5,7,9,11,13,15');
		$scope.defineTriggers();
	}

	return vm;

};

angular
    .module('bdb')
    .controller('UsersCtrl', UsersCtrl);
/**
 * ApplicationsCtrl - controller
 */
function ApplicationsCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

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
			+ '&order=key&from=0&to=10&status=7&role=17'
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableActive);
		$http.get(CommonsService.getUrl('/user') 
			+ '&order=key&from=0&to=10&status=1,3,5&role=17'
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableInactive);

	}

	$scope.fillRecord = function(obj, status) {
		var row = '<tr>'
	    		+ '<td data-value="' + obj.identifier + '">' + obj.identifier + '</td>'
	    		+ '<td data-value="' + (obj.fullname === undefined ? '' : obj.fullname) 
	    					  + '">' + (obj.fullname === undefined ? '-' : obj.fullname) + '</td>'
	    		+ '<td data-value="' + obj.hotname + '"><a href="/#/index/apuptime/' 
	    							 + obj.hostname + '"><i class="fa fa-line-chart"></i></a></td>'
	    		+ '</tr>';
	    return row;
	}

	$scope.getUserType = function(role) {
		if( role == 0 ) return "Usuario";
		if( role == 1 ) return "Administrador";
		if( role == 3 ) return "Country Admin";
		if( role == 5 ) return "Centro Comercial";
		if( role == 7 ) return "Cadena";
		if( role == 9 ) return "Club de Beneficios";
		if( role == 11 ) return "Data Entry";
		if( role == 13 ) return "Solo Lectura";
		if( role == 15 ) return "Adminstrador de Cupones";
		if( role == 17 ) return "Aplicacion";
	}

	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'user', data, '7', '17');
	}

	$scope.fillTableInactive = function(data) {
		CommonsService.paginateCommonTable($scope, 'user', data, '1,3,5', '17');
	}

	return vm;

};

angular
    .module('bdb')
    .controller('ApplicationsCtrl', ApplicationsCtrl);
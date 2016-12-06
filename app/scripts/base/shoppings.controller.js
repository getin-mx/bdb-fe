/**
 * ShoppingsCtrl - controller
 */
function ShoppingsCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

	var vm = this;
	$scope.search = '';
	$scope.countries = null;
	$scope.country = null;
	$scope.status = [{},{}];


	$scope.init = function() {

		$scope.countries = new Array();
		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/countries'))
			.then($scope.postInit);

	}

	$scope.postInit = function(data) {

		// validate token
		if( data.status != 200 || data.data.error_code !== undefined )
	        AuthenticationService.logout(function(response) {
	            $location.path('/login');    
	        });

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

	$scope.clean = function() {

		$scope.search = ''
		$scope.refresh();

	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/shopping') 
			+ '&order=name&from=0&to=10&status=0&country=' + $scope.country.id 
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableActive);
		$http.get(CommonsService.getUrl('/shopping') 
			+ '&order=name&from=0&to=10&status=1&country=' + $scope.country.id 
			+ '&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTableInactive);

	}

	$scope.fillRecord = function(obj, status) {
		var row = '<tr>'
	    		+ '<td data-value="' + obj.identifier + '">' + obj.name + '</td>'
	    		+ '<td data-value="' + (obj.country === undefined ? '' : obj.country) 
	    					  + '">' + (obj.country === undefined ? '-' : obj.country) + '</td>'
	    		+ '<td data-value="' + obj.hotname + '"><a href="/#/index/apuptime/' 
	    							 + obj.hostname + '"><i class="fa fa-line-chart"></i></a></td>'
	    		+ '</tr>';
	    return row;
	}

	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'shopping', data, 0);
	}

	$scope.fillTableInactive = function(data) {
		CommonsService.paginateCommonTable($scope, 'shopping', data, 1);
	}

	return vm;

};
angular
	.module('bdb')
	.controller('ShoppingsCtrl', ShoppingsCtrl);
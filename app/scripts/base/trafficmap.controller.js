/**
 * TrafficMapCtrl - controller
 */
function TrafficMapCtrl($scope, $http, $location, CommonsService, AuthenticationService) {

	var vm = this;
	$scope.brands = null;
	$scope.brand = null;
	$scope.stores = null;
	$scope.store = null;
	$scope.clear = {
		count: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	}

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
		if( data.data === undefined 
			|| data.data.address === undefined 
			|| data.data.address.latitude === undefined ) {
			data.data = {
				address: {
					latitude: 19.412457,
					longitude: -99.1404902
				}
			}
		}

		initSinTraficoMap({lat: data.data.address.latitude, lng: data.data.address.longitude}, 'map');
		$scope.loadTable($scope.clear);
		getFlow(
			{ 
				lat: data.data.address.latitude, 
				lng: data.data.address.longitude
			}, 
			function(data) {
				console.log(data)
				$scope.loadTable(data);
			},
			function(){
				console.log('Error getting traffic flow')
			});
		
		$scope.loadingRefresh = false;
	}

	$scope.loadTable = function(data) {
		var trafficTable = $('#traffic-table').data('footable');
		$("#traffic-table>tbody>tr").each(function(index, elem){$(elem).remove();});

		var row = '';
		row += '<tr>'
			   + '<td><center><strong>' + 6 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(6)] + '</center></td>'
			   + '<td><center><strong>' + 14 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(14)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 7 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(7)] + '</center></td>'
			   + '<td><center><strong>' + 15 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(15)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 8 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(8)] + '</center></td>'
			   + '<td><center><strong>' + 16 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(16)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 9 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(9)] + '</center></td>'
			   + '<td><center><strong>' + 17 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(17)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 10 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(10)] + '</center></td>'
			   + '<td><center><strong>' + 18 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(18)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 11 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(11)] + '</center></td>'
			   + '<td><center><strong>' + 19 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(19)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 12 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(12)] + '</center></td>'
			   + '<td><center><strong>' + 20 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(20)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 13 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(13)] + '</center></td>'
			   + '<td><center><strong>' + 21 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(21)] + '</center></td>'
			   + '</tr>';

		trafficTable.appendRow(row);
	}

	$scope.convertGMT = function(hour) {
		var offset = 6;
		if( hour < offset ) hour += 24;
		return (hour - offset);
	}

	return vm;
};



angular
	.module('bdb')
	.controller('TrafficMapCtrl', TrafficMapCtrl);

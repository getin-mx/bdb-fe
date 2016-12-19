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

	$scope.dayType = null;
	$scope.hourType = null;
	$scope.hour = null;
	$scope.dayTypes = new Array();
	$scope.hourTypes = new Array();
	$scope.hours = new Array();

	$scope.init = function() {

		$scope.brands = new Array();
		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
			.then($scope.postInit);

		$scope.dayTypes.push({
			id: 1,
			name: 'Entre Semana'
		})

		$scope.dayTypes.push({
			id: 2,
			name: 'Fin de Semana'
		})

		$scope.hourTypes.push({
			id: 1,
			name: 'Día completo'
		})

		$scope.hourTypes.push({
			id: 2,
			name: 'Hora Pico'
		})

		$scope.hourTypes.push({
			id: 3,
			name: 'Hora no Pico'
		})

		$scope.hours.push({
			id: 1,
			name: 'Día Completo'
		})

		$scope.hours.push({
			id: 2,
			name: 'Matutino'
		})

		$scope.hours.push({
			id: 3,
			name: 'Vespertino'
		})

		$scope.hours.push({
			id: 4,
			name: 'Nocturno'
		})

		$scope.dayType = $scope.dayTypes[0];
		$scope.hourType = $scope.hourTypes[0];
		$scope.hour = $scope.hours[0];

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

		// Set Layer information
		var layer = '';
		if( $scope.dayType.id == 1 ) {
			layer = 'heatmap';
		} else if( $scope.dayType.id == 2 ) {
			layer = 'heatmap_weekend';
		}

		if( $scope.hour.id == 1 ) {
			if( $scope.hourType.id == 2 ) {
				layer += '_rush';
			} else if( $scope.hourType.id == 3 ) {
				layer += '_norush';
			}
		} else {
			if( $scope.hour.id == 2 ) {
				layer += '_morning';
			} else if( $scope.hour.id == 3 ) {
				layer += '_afternoon';
			} else if( $scope.hour.id == 4 ) {
				layer += '_night';
			}
		}
		layer += '.json';

		// Initialize Sin Trafico Lib
		initSinTraficoMap({lat: data.data.address.latitude, lng: data.data.address.longitude}, 'map', layer);
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

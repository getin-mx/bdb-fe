/**
 * TrafficDetailsCtrl - controller
 */
function TrafficDetailsCtrl($scope, $http, $location, CommonsService, AuthenticationService) {
	var vm = this;

	$scope.clear = {
		count: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		speed: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		street_name: '',
		lanes: 0,
		km: 0
	}
	$scope.streetName = '';
	$scope.lanes = 0;
	$scope.km = 0;

	$scope.init = function() {
		$scope.storeId = document.getElementById('storeId').value;
		$scope.lat = document.getElementById('lat').value;
		$scope.lng = document.getElementById('lng').value;

		$scope.loadTable($scope.clear);
		getFlow(
			{ 
				lat: $scope.lat,
				lng: $scope.lng
			}, 
			function(data) {
				console.log(data)
				$scope.loadTable(data);
			},
			function(){
				console.log('Error getting traffic flow')
			});

	};

	$scope.loadTable = function(data) {
		var st = data.street_name;
		if( data.km > 0 ) {
			st = st + ' KM ' + data.km.toFixed(2);
		}
		if( data.lanes == 1 ) {
			st = st + ' (1 sentido)';
		} else if( data.lanes > 1 ) {
			st = st + ' (' + data.lanes + ' sentidos)';
		}
		$scope.streetName = st;

		var trafficTable = $('#traffic-table').data('footable');
		$("#traffic-table>tbody>tr").each(function(index, elem){$(elem).remove();});

		var row = '';
		row += '<tr>'
			   + '<td><center><strong>' + 6 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(6)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(6)] + '</center></td>'
			   + '<td><center><strong>' + 14 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(14)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(14)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 7 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(7)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(7)] + '</center></td>'
			   + '<td><center><strong>' + 15 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(15)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(15)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 8 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(8)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(8)] + '</center></td>'
			   + '<td><center><strong>' + 16 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(16)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(16)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 9 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(9)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(9)] + '</center></td>'
			   + '<td><center><strong>' + 17 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(17)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(17)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 10 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(10)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(10)] + '</center></td>'
			   + '<td><center><strong>' + 18 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(18)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(18)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 11 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(11)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(11)] + '</center></td>'
			   + '<td><center><strong>' + 19 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(19)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(19)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 12 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(12)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(12)] + '</center></td>'
			   + '<td><center><strong>' + 20 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(20)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(20)] + '</center></td>'
			   + '</tr>';
		row += '<tr>'
			   + '<td><center><strong>' + 13 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(13)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(13)] + '</center></td>'
			   + '<td><center><strong>' + 21 + '</strong></center></td>'
			   + '<td><center>' + data.count[$scope.convertGMT(21)] + '</center></td>'
			   + '<td><center>' + data.speed[$scope.convertGMT(21)] + '</center></td>'
			   + '</tr>';

		trafficTable.appendRow(row);
		if(!$scope.$$phase) {
			$scope.$apply();
		}
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
	.controller('TrafficDetailsCtrl', TrafficDetailsCtrl);

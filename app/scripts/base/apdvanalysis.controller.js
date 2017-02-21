/**
 * APDVAnalysisCtrl - controller
 */
function APDVAnalysisCtrl($scope, $http, $location, $uibModal, CommonsService, AuthenticationService, SweetAlert) {

	var vm = this;
	$scope.search = '';

	$scope.brands = null;
	$scope.brand = null;
	$scope.stores = null;
	$scope.store = null;

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

	$scope.clean = function() {

		$scope.search = ''
		$scope.refresh();

	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$scope.anDate = $('#anDate').val();
		$http.get(CommonsService.getUrl('/apdvisit') 
			+ '&entityId=' + $scope.store.id
			+ '&date=' + $scope.anDate
			+ '&entityKind=3&checkinType=2&from=0&to=0&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTable);

	}

    $scope.generalClick = function(event){

		alert(event.target.attributes['data-click'].value);
    }

	$scope.fillTable = function(data) {

		var assignedCount = 0;

		//get the footable object
		var tableAssigned = $('#apdvisit-table').data('footable');

	    $("#apdvisit-table>tbody>tr").each(function(index, elem){$(elem).remove();});

	    tableAssignedRows = '';

	    for(var i = 0; i < data.data.data.length; i++) {
	    	var obj = data.data.data[i];
	    	var diff = 0;
	    	try {

		    	var st = new Date(obj.checkinStarted);
		    	var en = new Date(obj.checkinFinished);
		    	diff = Math.floor((en-st) / 1000 / 60);
		    	console.log(diff);


	    	} catch( ex ) {}

	    	var newRow = '<tr>'
	    			   + '<td data-value="' + obj.mac + '">' + obj.mac + '</td>'
	    			   + '<td data-value="' + obj.devicePlatform + '">' + obj.devicePlatform + '</td>'
	    			   + '<td data-value="' + obj.checkinStarted + '">' + obj.checkinStarted + '</td>'
	    			   + '<td data-value="' + obj.checkinFinished + '">' + obj.checkinFinished + '</td>'
	    			   + '<td data-value="' + obj.identifier + '">' + diff + ' mins</td>'
	    			   
	    			   + '<td data-value="' + obj.hostname + '">'

	    			   + '<a class="aphentry" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.apheSource + '"><i class="fa fa-map-marker"></i></a>'

	    			   + '</td>'

	    			   + '</tr>';

    		tableAssignedRows += newRow;
    		assignedCount++;
	    }

	    tableAssigned.appendRow(tableAssignedRows);

		$('#apdvisit-table').data('current-page', '0');
		$('#apdvisit-table').data('record-count', assignedCount);

		tableAssigned.redraw();

    	$("#apdvisit-count").html('&nbsp;(' + assignedCount + ')');

		$scope.loadingRefresh = false;

		// Define aplocation click response
		$('.aphentry').click(function(e) {
			e.preventDefault();
			// window.location = '/#/index/aphentry/' + encodeURIComponent($(e.currentTarget).data('value'));
			$location.path('/index/aphentry/' + encodeURIComponent($(e.currentTarget).data('value')));
			CommonsService.safeApply($scope);
		})

	}

	return vm;

};

angular
	.module('bdb')
	.controller('APDVAnalysisCtrl', APDVAnalysisCtrl);
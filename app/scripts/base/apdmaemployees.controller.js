/**
 * ÀPDMAEmployeesCtrl - controller
 */
function ÀPDMAEmployeesCtrl($scope, $rootScope, $http, $location, $uibModal, CommonsService, AuthenticationService, SweetAlert, $filter) {

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

	$scope.newRecord = function() {
		document.getElementById('identifierParam').value = 'new';
		document.getElementById('entityIdParam').value = $scope.store.id;
		document.getElementById('entityKindParam').value = 3;
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'views/base/apdmaemployee.settings.html',
            size: 'md',
            controller: APDMAEmployeeSettingsCtrl
        });
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
		$http.get(CommonsService.getUrl('/apdmaemployee') 
			+ '&entityId=' + $scope.store.id
			+ '&entityKind=3&from=0&to=0&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTable);

	}

    $rootScope.$on('apdmaemployee.update', function() {
        $scope.refresh();
        $scope.modalInstance.close();
    });

	$scope.fillTable = function(data) {

		var assignedCount = 0;

		//get the footable object
		var tableAssigned = $('#employee-table').data('footable');

	    $("#employee-table>tbody>tr").each(function(index, elem){$(elem).remove();});

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
	    			   + '<td data-value="' + obj.description + '">' + obj.description + '</td>'
	    			   + '<td data-value="' + obj.fromDate + '">' + $filter('date')(obj.fromDate, "dd/MM/yyyy") + '</td>'
	    			   + '<td data-value="' + obj.toDate + '">' + ((obj.toDate !== undefined) ? $filter('date')(obj.toDate, "dd/MM/yyyy") : '-') + '</td>'
	    			   
	    			   + '<td data-value="' + obj.identifier + '">'

	    			   + '<a class="edit" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.identifier + '"><i class="fa fa-pencil-square-o"></i></a>'
	    			   + '<a class="delete" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.identifier + '"><i class="fa fa-times"></i></a>'

	    			   + '</td>'

	    			   + '</tr>';

    		tableAssignedRows += newRow;
    		assignedCount++;
	    }

	    tableAssigned.appendRow(tableAssignedRows);

		$('#employee-table').data('current-page', '0');
		$('#employee-table').data('record-count', assignedCount);

		tableAssigned.redraw();

    	$("#employee-count").html('&nbsp;(' + assignedCount + ')');

		$scope.loadingRefresh = false;

		// Define edit click response
		$('.edit').click(function(e) {
			e.preventDefault();
			document.getElementById('identifierParam').value = $(e.currentTarget).data('value');
			document.getElementById('entityIdParam').value = $scope.store.id;
			document.getElementById('entityKindParam').value = 3;
	        $scope.modalInstance = $uibModal.open({
	            templateUrl: 'views/base/apdmaemployee.settings.html',
	            size: 'md',
	            controller: APDMAEmployeeSettingsCtrl
	        });
		})

        // Define delete click response
        $('.delete').click(function(e) {
            e.preventDefault();

            SweetAlert.swal({
                title: "Estas seguro?",
                text: "Si se elimina este empleado no podrá recuperarse!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, eliminalo!",
                cancelButtonText: "No, me arrepiento...",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $http.delete(CommonsService.getUrl('/apdmaemployee/' + $(e.currentTarget).data('value')))
                        .then(function(data) {
                            SweetAlert.swal("Eliminado!", "El empleado fue eliminado.", "success");
                            $scope.refresh();
                        });
                }
            });
        });

	}

	return vm;

};

angular
	.module('bdb')
	.controller('ÀPDMAEmployeesCtrl', ÀPDMAEmployeesCtrl);
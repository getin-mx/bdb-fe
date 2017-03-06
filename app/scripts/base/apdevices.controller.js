/**
 * APDevicesCtrl - controller
 */
function APDevicesCtrl($scope, $rootScope, $http, $location, $uibModal, CommonsService, AuthenticationService, SweetAlert) {

	var vm = this;
	$scope.search = '';

	$scope.clean = function() {

		$scope.search = ''
		$scope.refresh();

	}

	$scope.refresh = function() {

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/apdevice') + '&order=hostname&from=0&to=0&q=' + encodeURIComponent($scope.search))
			.then($scope.fillTable);

	}

	$scope.modalLocation = function(hostname) {
		document.getElementById('hostnameParam').value = hostname;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/base/aplocation.html',
            size: 'lg',
            controller: APLocationCtrl
        });
	}

	$scope.modalUptime = function(hostname) {
		document.getElementById('hostnameParam').value = hostname;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/base/apuptime.html',
            size: 'lg',
            controller: APUptimeCtrl
        });
	}

	$scope.modalSettings = function(hostname) {
		document.getElementById('hostnameParam').value = hostname;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/base/apdevice.settings.html',
            size: 'lg',
            controller: APDeviceSettingsCtrl
        });
	}

    $scope.generalClick = function(event){

		alert(event.target.attributes['data-click'].value);
    }

    $scope.export = function() {
        var url =  config.baseUrl + '/dashboard/apdeviceExport' 
        + '?authToken=' + $rootScope.globals.currentUser.token 
        + '&status=0'

        window.open(url);

    }

	$scope.fillTable = function(data) {

		var assignedCount = 0;
		var offlineCount = 0;
		var unassignedCount = 0;
		var downCount = 0;

		//get the footable object
		var tableAssigned = $('#apdevice-assigned-table').data('footable');
		var tableOffline = $('#apdevice-offline-table').data('footable');
		var tableUnassigned = $('#apdevice-unassigned-table').data('footable');
		var tableDown = $('#apdevice-down-table').data('footable');

	    $("#apdevice-assigned-table>tbody>tr").each(function(index, elem){$(elem).remove();});
	    $("#apdevice-offline-table>tbody>tr").each(function(index, elem){$(elem).remove();});
	    $("#apdevice-unassigned-table>tbody>tr").each(function(index, elem){$(elem).remove();});
	    $("#apdevice-down-table>tbody>tr").each(function(index, elem){$(elem).remove();});

	    tableDownRows = '';
	    tableUnassignedRows = '';
	    tableOfflineRows = '';
	    tableAssignedRows = '';

	    for(var i = 0; i < data.data.data.length; i++) {
	    	var obj = data.data.data[i];
	    	var newRow = '<tr>'
	    			   + '<td data-value="' + obj.hostname + '">' + obj.hostname + '</td>'
	    			   + '<td data-value="' + (obj.description === undefined ? '' : obj.description) 
	    			   				 + '">' + (obj.description === undefined ? '-' : obj.description) + '</td>'
	    			   + '<td data-value="' + (obj.model === undefined ? '' : obj.model) 
	    			   				 + '">' + (obj.model === undefined ? '-' : obj.model) + '</td>'
	    			   + '<td data-value="' + (obj.mode === undefined ? '' : obj.mode) 
	    			   				 + '">' + (obj.mode === undefined ? '-' : obj.mode) + '</td>'
	    			   + '<td data-value="' + (obj.version === undefined ? '' : obj.version) 
	    			   				 + '">' + (obj.version === undefined ? '-' : obj.version) + '</td>'
	    			   + '<td data-value="' + obj.lastRecordDate + '">' + obj.lastRecordDate + '</td>'
	    			   
	    			   + '<td data-value="' + obj.hostname + '">'

	    			   + '<a class="aplocation" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.hostname + '"><i class="fa fa-map-marker"></i></a>'
	    			   + '<a class="apdevicesettings" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.hostname + '"><i class="fa fa-cog"></i></a>'

	    			   + ((obj.status == 0 )
	    			   ? '<a class="apdevicedisable" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.hostname + '"><i class="fa fa-arrow-down"></i></a>' : '')

	    			   + ((obj.status == 1 || obj.reportable != true )
	    			   ? '<a class="apdevicedelete" style="margin-left: 10px;" href="#" '
	    			   + 'data-value="' + obj.hostname + '"><i class="fa fa-trash"></i></a>' : '')

	    			   + '</td>'

	    			   + '</tr>';

	    	if( obj.status == 1 ) {
    			tableDownRows += newRow;
    			downCount++;
	    	} else if( obj.reportable != true ) {
    			tableUnassignedRows += newRow;
    			unassignedCount++;
	    	} else if( obj.reportStatus == 1 ) {
	    		tableOfflineRows += newRow;
	    		offlineCount++;
	    	} else {
	    		tableAssignedRows += newRow;
	    		assignedCount++;
	    	}
	    }

	    tableDown.appendRow(tableDownRows);
	    tableUnassigned.appendRow(tableUnassignedRows);
	    tableOffline.appendRow(tableOfflineRows);
	    tableAssigned.appendRow(tableAssignedRows);

		$('#apdevice-assigned-table').data('current-page', '0');
		$('#apdevice-offline-table').data('current-page', '0');
		$('#apdevice-unassigned-table').data('current-page', '0');
		$('#apdevice-down-table').data('current-page', '0');
		$('#apdevice-assigned-table').data('record-count', assignedCount);
		$('#apdevice-offline-table').data('record-count', offlineCount);
		$('#apdevice-unassigned-table').data('record-count', unassignedCount);
		$('#apdevice-down-table').data('record-count', downCount);

		tableAssigned.redraw();
		tableOffline.redraw();
		tableUnassigned.redraw();
		tableDown.redraw();

    	$("#apdevice-assigned-count").html('&nbsp;(' + assignedCount + ')');
    	$("#apdevice-offline-count").html('&nbsp;(' + offlineCount + ')');
    	$("#apdevice-unassigned-count").html('&nbsp;(' + unassignedCount + ')');
    	$("#apdevice-down-count").html('&nbsp;(' + downCount + ')');

		$scope.loadingRefresh = false;

		// Define aplocation click response
		$('.aplocation').click(function(e) {
			e.preventDefault();
			$scope.modalLocation($(e.currentTarget).data('value'));
		})

		// Define aplocation click response
		$('.apuptime').click(function(e) {
			e.preventDefault();
			$scope.modalUptime($(e.currentTarget).data('value'));
		})

		// Define apdevicesettings click response
		$('.apdevicesettings').click(function(e) {
			e.preventDefault();
			$scope.modalSettings($(e.currentTarget).data('value'));
		})

		// Define apdevicedisable click response
		$('.apdevicedisable').click(function(e) {
			e.preventDefault();

            SweetAlert.swal({
                title: "Estas seguro?",
                text: "Quieres dar de baja esta antena?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, dar de baja!",
                cancelButtonText: "No, me arrepiento...",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $http.get((CommonsService.getUrl('/apdevice/' + $(e.currentTarget).data('value'))))
                        .then(function(data) {
                            data.data.status = 1;
                            $http.post((CommonsService.getUrl('/apdevice')), data.data)
                                .then(function(data) {
                                    SweetAlert.swal("Dada de Baja!", "La antena fue dada de baja", "success");
                                    $scope.refresh();
                                })
                        })
                }
            });
		})

        // Define apdevicedelete click response
        $('.apdevicedelete').click(function(e) {
            e.preventDefault();

            SweetAlert.swal({
                title: "Estas seguro?",
                text: "Si se elimina esta antena se perderá toda la configuración asociada a ella!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si, eliminalo!",
                cancelButtonText: "No, me arrepiento...",
                closeOnConfirm: false,
                closeOnCancel: true },
            function (isConfirm) {
                if (isConfirm) {
                    $http.delete(CommonsService.getUrl('/apdevice/' + $(e.currentTarget).data('value')))
                        .then(function(data) {
                            SweetAlert.swal("Eliminado!", "La antena fue eliminada.", "success");
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
	.controller('APDevicesCtrl', APDevicesCtrl);
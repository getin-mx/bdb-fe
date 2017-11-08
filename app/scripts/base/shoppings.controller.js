/**
 * ShoppingsCtrl - controller
 */
function ShoppingsCtrl($scope, $http, $location, CommonsService, AuthenticationService, $uibModal) {

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
	            $location.path('/loginAdmin');    
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
			   + '<td data-value="' + obj.identifier + '">'

			   + '<a class="shoppingsettings" style="margin-left: 10px;" href="#" '
			   + 'data-value="' + obj.identifier + '"><i class="fa fa-cog"></i></a>'

			   + '<a class="shoppingdelete" style="margin-left: 10px;" href="#" '
			   + 'data-value="' + obj.identifier + '"><i class="fa fa-trash"></i></a>'

			   + '</td>'
	    		+ '</tr>';
	    return row;
	}

	$scope.fillTableActive = function(data) {
		CommonsService.paginateCommonTable($scope, 'shopping', data, 0);
		$scope.completeTable();
	}

	$scope.fillTableInactive = function(data) {
		CommonsService.paginateCommonTable($scope, 'shopping', data, 1);
		$scope.completeTable();
	}

	$scope.modalSettings = function(identifier) {
		document.getElementById('identifierParam').value = identifier;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/base/shopping.settings.html',
            size: 'lg',
            controller: ShoppingSettingsCtrl
        });
	}

	$scope.completeTable = function() {
		$('.shoppingsettings').click(function(e) {
			e.preventDefault();
			$scope.modalSettings($(e.currentTarget).data('value'));
		})

	    // Define shoppingdelete click response
	    $('.shoppingdelete').click(function(e) {
	        e.preventDefault();

	        swal({
	            title: "Estas seguro?",
	            text: "Si se elimina centro comercial se perderá toda la configuración asociada a el!",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "Si, eliminalo!",
	            cancelButtonText: "No, me arrepiento...",
	            closeOnConfirm: false,
	            closeOnCancel: true },
	        function (isConfirm) {
	            if (isConfirm) {
	                $http.delete(CommonsService.getUrl('/shopping/' + $(e.currentTarget).data('value')))
	                    .then(function(data) {
	                        swal("Eliminado!", "El centro comercial fue eliminada.", "success");
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
	.controller('ShoppingsCtrl', ShoppingsCtrl);
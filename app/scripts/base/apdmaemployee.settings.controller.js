/**
 * APDMAEmployeeSettingsCtrl - controller
 */
 function APDMAEmployeeSettingsCtrl($rootScope, $scope, $http, $stateParams, $location, CommonsService, AuthenticationService , $timeout, $filter) {

	var vm = this;

    $scope.init = function() {

        if( $stateParams.identifier !== undefined ) {
            $scope.identifier = $stateParams.identifier;
        } else {
            $scope.identifier = document.getElementById('identifierParam').value;
        }

        if($scope.identifier == '' || $scope.identifier == 'new') {
            $scope.new();
        } else {
            $scope.load($scope.identifier);
        }

    }

    $scope.new = function() {
        $scope.obj = {};

        $scope.obj.entityId = document.getElementById('entityIdParam').value;
        $scope.obj.entityKind = document.getElementById('entityKindParam').value;

        $scope.fromDate = new Date();
        $scope.toDate = null;
    }

    $scope.load = function(identifier) {
        $http.get(CommonsService.getUrl('/apdmaemployee/' + identifier))
            .then(function(data) {
                $scope.obj = data.data;
                if( data.status == 200 ) {
                    $scope.classUpdating = '';
                    $scope.classAdding = 'hidden';

                    $scope.fromDate = $scope.obj.fromDate;
                    $scope.toDate = $scope.obj.toDate;
                    if( $scope.obj.fromDate === undefined || $scope.obj.fromDate === null ) {
                        $scope.obj.fromDate = null;
                        $('#fromDate').val('');
                    }
                    if( $scope.obj.toDate === undefined || $scope.obj.toDate === null ) {
                        $scope.obj.toDate = null;
                        $('#toDate').val('');
                    }

                    CommonsService.safeApply($scope);
                }

            });
    }

    $scope.update = function() {
        $scope.loadingSubmit = true;

        $scope.obj.fromDate = $('#fromDate').val();
        $scope.obj.toDate = $('#toDate').val();

        if( $scope.obj.identifier != null && $scope.obj.identifier != undefined )  {
            $http.post((CommonsService.getUrl('/apdmaemployee')), $scope.obj)
                .then($scope.postUpdate);
        } else {
            $http.put((CommonsService.getUrl('/apdmaemployee')), $scope.obj)
                .then($scope.postUpdate);
        }
    }

    $scope.postUpdate = function(data) {
        console.log(data);

        if( data.status = 200
            && data.data.error_code === undefined ) {
            alert("La configuración del empleado fue salvada con éxito");

            $scope.loadingSubmit = false;
            $rootScope.$emit('apdmaemployee.update')

        } else {
            alert("La configuración del empleado no pudo salvarse");
        }

    }

	return vm;
};

angular
	.module('bdb')
	.controller('APDMAEmployeeSettingsCtrl', APDMAEmployeeSettingsCtrl);

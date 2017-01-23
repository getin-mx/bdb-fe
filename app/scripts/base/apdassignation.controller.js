/**
 * APDAssignationCtrl - controller
 */
 function APDAssignationCtrl($rootScope, $scope, $http, $stateParams, $location, CommonsService, AuthenticationService, SweetAlert, $timeout, $filter) {

    var vm = this;

    $scope.new = function() {
        $scope.obj = {};
        $scope.classUpdating = 'hidden';
        $scope.classAdding = '';

        $scope.fromDate = new Date();
        $scope.toDate = null;

        $scope.brandInit();
    }

    $scope.load = function(identifier) {
        $http.get(CommonsService.getUrl('/apdassignation/' + identifier))
            .then(function(data) {
                $scope.obj = data.data;
                if( data.status == 200 ) {
                    $scope.classUpdating = '';
                    $scope.classAdding = 'hidden';
                    $scope.brand.id = $scope.obj.brandId;
                    $scope.brand.name = $scope.obj.brandName;
                    $scope.store.id = $scope.obj.entityId;
                    $scope.store.name = $scope.obj.name;

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
                }

            });
    }

    $scope.updateAssignation = function() {
        $scope.loadingUpdate = true;
        $scope.obj.hostname = $scope.hostname;
        $scope.obj.entityId = $scope.store.id;
        $scope.obj.entityKind = 3;
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();
        $scope.obj.fromDate = $scope.fromDate;
        $scope.obj.toDate = $scope.toDate;

        if( $scope.obj.identifier != null && $scope.obj.identifier != undefined )  {
            $http.post((CommonsService.getUrl('/apdassignation')), $scope.obj)
                .then($scope.postUpdateAssignation);
        } else {
            $http.put((CommonsService.getUrl('/apdassignation')), $scope.obj)
                .then($scope.postUpdateAssignation);
        }

    }

    $scope.postUpdateAssignation = function(data) {
        console.log(data);
        $scope.loadingUpdate = false;

        if( data.status = 200 
            && data.data.error_code === undefined ) {
            SweetAlert.swal({
                title: "Ok!",
                text: "La asignación fue salvada con éxito",
                type: "success"
            });
        } else {
            SweetAlert.swal({
                title: "Error!",
                text: "La asignación no pudo salvarse",
                type: "error"
            });
        }

        $rootScope.$emit('adpassignation.update');
    }

    $scope.brandInit = function() {

        $scope.brands = new Array();
        $scope.loadingRefresh = true;
        $http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
            .then(function(data) {

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

            });
    }

    $scope.brandChange = function() {

        $scope.stores = new Array();
        $scope.loadingRefresh = true;
        if( $scope.brand !== null && $scope.brand.id !== null )
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

    }

    $scope.cancel = function() {
        $rootScope.$emit('adpassignation.cancel');
    }

    $rootScope.$on('adpassignation.new', function() {
        $scope.hostname = $rootScope.APDAssignationParms.hostname;
        $scope.identifier = undefined;
        $scope.new();
    })

    $rootScope.$on('adpassignation.load', function() {
        $scope.hostname = $rootScope.APDAssignationParms.hostname;
        $scope.identifier = $rootScope.APDAssignationParms.identifier;
        $scope.$apply();
        $scope.load($scope.identifier);
    });

    return vm;
};

angular
    .module('bdb')
    .controller('APDAssignationCtrl', APDAssignationCtrl);

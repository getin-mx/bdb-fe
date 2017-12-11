/**
 * OpenTimesCtrl - controller
 */
 function OpenTimesCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http) {

    var vm = this;

    $scope.brands = null;
    $scope.brand = null;
    $scope.stores = null;
    $scope.store = null;

    var dToDate = new Date(new Date().getTime() - config.oneDay);
    var dFromDate = new Date(dToDate.getTime() - config.oneWeek);

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.storeLabel = 'Tienda';

    $scope.init = function() {

        $scope.brands = new Array();

        $http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
        .then(function(data) {
            $scope.toDate = dToDate.format("yyyy-mm-dd", null);
            $('#toDate').val($scope.toDate);
            $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
            $('#fromDate').val($scope.fromDate);

            // validate token
            if( data.status != 200 || data.data.error_code !== undefined )
                AuthenticationService.logout(function(response) {
                    $location.path('/loginAdmin');
                });

            if( data.data.data.length == 1 ) {
                $('#brandSelectorContainer').css('display','none');
            } else {
                $('#brandSelectorContainer').css('display','block');
            }

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
        $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
            + '&entityId=' + $scope.brand.id
            + '&entityKind=1&onlyExternalIds=true')
            .then($scope.postBrandChange);
    }

    $scope.postBrandChange = function(data) {

        $scope.updateStoreLabel();
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

    $scope.updateStoreLabel = function() {
        $http.get(CommonsService.getUrl('/dashboard/config')
            + '&entityId=' + $scope.brandId
            + '&entityKind=1')
        .then(function(data){
            try {
                $scope.storeLabel = data.data.storeLabel;
                if( $scope.storeLabel === undefined || $scope.storeLabel == null )
                    $scope.storeLabel = 'Tienda';
            } catch( e ) {
                $scope.storeLabel = 'Tienda';
            }
        });
    }

    $scope.refresh = function() {
        $scope.loadingRefresh = true;

        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        $('#opentimes_table').html('');
        $scope.updateTable('#opentimes_table', config.baseUrl, $scope.fromDate, $scope.toDate, $scope.store.id);
        CommonsService.safeApply($scope);
    }

    $scope.updateTable = function(id, baseUrl, fromDate, toDate, entityId) {
        $.getJSON(
            baseUrl
            + '/dashboard/opentimes'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + entityId
            + '&entityKind=3'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate ,
            function(data) {
                var tab = '';
                tab = '<table class="table table-striped" style="text-align: center;">';
                tab += '<tr style="font-weight:bold;">';
                tab += '<td>' + $scope.storeLabel + '</td>';
                tab += '<td>Apertura registrada</td>';
                tab += '<td>Cierre registrado</td>';
                tab += '<td>Dia</td>';
                tab += '<td>Apertura reportada</td>';
                tab += '<td>Cierre reportado</td>';
                tab += '</tr>';
                tab += '<tbody>';
                for (var i = 1; i < data.length - 1; i++) {
                    tab += '<tr>';
                    for (var x = 0; x < data[i].length; x++) {
                        tab += '<td>' + data[i][x] + '</td>';
                    }
                    tab += '</tr>';
                }
                tab += '</tbody>';
                tab += '</table>';
                $(id).html(tab);
                $scope.loadingRefresh = false;
                CommonsService.safeApply($scope);
            });
    };

    return vm;
};

angular
.module('bdb')
.controller('OpenTimesCtrl', OpenTimesCtrl);

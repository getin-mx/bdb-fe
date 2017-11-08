/**
 * EmployeeTimesCtrl - controller
 */
 function EmployeeTimesCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http) {

    var vm = this;

    $scope.brands = null;
    $scope.brand = null;
    $scope.stores = null;
    $scope.store = null;
    $scope.employees = null;
    $scope.employee = null;

    var dToDate = new Date(new Date().getTime() - config.oneDay);
    var dFromDate = new Date(dToDate.getTime() - config.oneWeek);

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.storeLabel = '';

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
            .then(function(data) {
                $scope.updateStoreLabel();
                var store = {
                    id: '',
                    name: 'Todas'
                }
                $scope.stores.push(store);
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
            });

        $scope.employees = new Array();
        $http.get(CommonsService.getUrl('/dashboard/assignedEmployeeList')
            + '&entityId=' + $scope.brand.id
            + '&entityKind=1')
            .then(function(data) {
                var employee = {
                    id: '',
                    name: 'Todos'
                }
                $scope.employees.push(employee);
                for( var i = 0; i < data.data.data.length; i++ ) {
                    var employee = {
                        id: data.data.data[i].identifier,
                        name: data.data.data[i].name
                    }
                    $scope.employees.push(employee);
                }
                $scope.employee = $scope.employees[0];
                $scope.loadingRefresh = false;

                $scope.refresh();
            });
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
        $scope.updateTable();
        CommonsService.safeApply($scope);
    }

    $scope.updateTable = function() {
        var eid;
        var ekind;
        var emp = '';
        if( $scope.store == null || $scope.store.id == '' ) {
            eid = $scope.brand.id;
            ekind = 1;
        } else {
            eid = $scope.store.id;
            ekind = 3;
        }

        if( $scope.employee !== null && $scope.employee.id !== undefined ) {
            emp = $scope.employee.id;
        }

        $.getJSON(
            CommonsService.getUrl('/dashboard/employeetimes')
            + '&entityId=' + eid
            + '&entityKind=' + ekind
            + '&employeeId=' + emp
            + '&fromStringDate=' + $scope.fromDate
            + '&toStringDate=' + $scope.toDate ,
            function(data) {

                $('#employee-table>tbody>tr').each(function(index, elem){$(elem).remove();});

                //get the footable object
                var table = $('#employee-table').data('footable');

                var newRow = '';
                for(var i = 0; i < data.data.length; i++) {
                    var obj = data.data[i];
                    var row = '<tr>'
                            + '<td data-value="' + obj.store + ':' + obj.employee + ':' + obj.date + ':' + obj.start + '"><center>' + obj.store + '</center></td>'
                            + '<td data-value="' + obj.employee + ':' + obj.date + ':' + obj.start + '"><center>' + obj.employee + '</center></td>'
                            + '<td data-value="' + obj.date + ':' + obj.start + ':' + obj.store + ':' + obj.employee + '"><center>' + obj.date + '</center></td>'
                            + '<td data-value="' + obj.date + ':' + obj.start + '"><center>' + obj.start + '</center></td>'
                            + '<td data-value="' + obj.date + ':' + obj.finish + '"><center>' + obj.finish + '</center></td>'
                            + '</tr>';

                    newRow += row;
                }

                table.appendRow(newRow);

                $scope.loadingRefresh = false;
                CommonsService.safeApply($scope);
            });
    };

    return vm;
};

angular
.module('bdb')
.controller('EmployeeTimesCtrl', EmployeeTimesCtrl);

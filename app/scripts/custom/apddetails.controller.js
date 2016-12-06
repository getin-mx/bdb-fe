/**
 * APDDetailsCtrl - controller
 */
function APDDetailsCtrl($scope, AuthenticationService, $rootScope, $http) {

    var vm = this;

    var dToDate = new Date(new Date().getTime() - config.oneDay);
    var dFromDate = new Date(dToDate.getTime() - config.oneWeek);

    $scope.toDate = dToDate.format("yyyy-mm-dd", null);
    $('#toDate').val($scope.toDate);
    $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
    $('#fromDate').val($scope.fromDate);
    $scope.storeId = '';

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;
    $scope.brandId = credentials.identifier;

    $scope.exportAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/visitDetailExport' 
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&brandId=' + $scope.brandId 
            + '&storeId=' + $scope.storeId
            + '&fromStringDate=' + $scope.fromDate
            + '&toStringDate=' + $scope.toDate

        window.open(url);
    }

    $scope.updateAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        vm.filterAPDVisits($scope.brandId, $scope.storeId, $scope.fromDate, $scope.toDate);
    }

    this.filterAPDVisits = function(brandId, storeId, fromDate, toDate) {
        console.log(fromDate);
        console.log(toDate);

        vm.updateBrandPerformanceTable('#brand_performance_table', config.dashUrl, fromDate, toDate, brandId);
    }

    this.updateStoreList = function(id, baseUrl, entityId) {
        $.getJSON(
            baseUrl 
            + '/dashoard/storesFilter?entityId=' + entityId 
            + '&entityKind=1' 
            + '&toStringDate=' + toDate 
            + '&onlyExternalIds=true',
            function(data) {
                $(id).empty();
                $(id).append($('<option>', {
                    value: '',
                    text: 'Todas'
                }));
                $.each(data, function(idx, item) {
                    $(id).append($('<option>', {
                        value: item.identifier,
                        text: item.name
                    }));
                });
            });
    }
    this.updateBrandPerformanceTable = function(id, baseUrl, fromDate, toDate, entityId) {
        $.getJSON(
            baseUrl 
            + '/dashoard/brandTableData?entityId=' + entityId 
            + '&entityKind=1' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&onlyExternalIds=true',
            function(data) {
                var tab = '';
                tab = '<table class="table table-striped" style="text-align: center;" >';
                tab += '<tr style="font-weight:bold;">';
                tab += '<td>Tienda</td>';
                tab += '<td>Paseantes</td>';
                tab += '<td>Visitantes</td>';
                tab += '<td>Tickets</td>';
                tab += '<td>Paseantes/Visitantes</td>';
                tab += '<td>Visitantes/Tickets</td>';
                tab += '<td>Día más Alto</td>';
                tab += '<td>Día más Bajo</td>';
                tab += '<td>Permanencia Promedio</td>';
                tab += '</tr>';
                tab += '<tbody>';
                for (var i = 1; i < data.length - 1; i++) {
                    tab += '<tr>';
                    for (var x = 0; x < data[i].length; x++) {
                        if (x == 0 || x == 3 || x == 5 || x == 7)
                            tab += '<td style="border-right: 1px solid gray;">' + data[i][x] + '</td>';
                        else
                            tab += '<td>' + data[i][x] + '</td>';
                    }
                    tab += '</tr>';
                }
                tab += '<tr style="font-weight:bold;">';
                for (var x = 0; x < data[data.length - 1].length; x++) {
                    if (x == 0 || x == 3 || x == 5 || x == 7)
                        tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                    else
                        tab += '<td>' + data[data.length - 1][x] + '</td>';
                }
                tab += '</tr></tbody></table>';

                tab += '</tbody>';
                tab += '</table>';
                $(id).html(tab);
            });
    };

    this.updateStoreList('#store', config.dashUrl, $scope.brandId);
    $scope.updateAPDVisits();

    return vm;
};

angular
    .module('bdb')
    .controller('APDDetailsCtrl', APDDetailsCtrl);
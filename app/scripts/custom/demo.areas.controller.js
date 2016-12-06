/**
 * DemoAreasCtrl - controller
 */
function DemoAreasCtrl($scope, AuthenticationService) {

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
    $scope.brandId = 'sportium_mx';

    $scope.updateAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        vm.filterAPDVisits($scope.brandId, $scope.storeId, $scope.fromDate, $scope.toDate);
    }

    this.filterAPDVisits = function(brandId, storeId, fromDate, toDate) {
        console.log(fromDate);
        console.log(toDate);

        vm.updateVisitsByDateChart('#visits_by_date', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateVisitsByHourChart('#visits_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updatePermanenceByHourChart('#permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateHeatmapTraffic('#heatmap_traffic_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateHeatmapPermanence('#heatmap_permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateBrandPerformanceTable('#brand_performance_table', config.dashUrl, fromDate, toDate, brandId);
    }

    this.updateHeatmapTable = function(id, table, baseUrl, fromDate, toDate, entityId, cinemaId, dayOfWeek) {
        $.getJSON(baseUrl
                + '/dashoard/heatmapTableData?entityId=' + entityId
                + '&entityKind=1'
                + '&subentityId=' + cinemaId
                + '&elementId=heatmap'
                + '&dayOfWeek=' + dayOfWeek
                + '&top=15'
                + '&fromStringDate=' + fromDate 
                + '&toStringDate=' + toDate, function(data) {

            vm.updateDescriptionTable(table, data.description);
            areas = [];
            for( var i = 0; i < data.description.length; i++) {
                areas.push(data.description[i][1]);
            }
            
            
            $(id).highcharts({
                chart: {
                    type: 'heatmap',
                    marginTop: 40,
                    marginBottom: 80
                },

                title: {
                    text: 'Afluencia del Centro Comercial'
                },

                xAxis: {
                    categories: data.xCategories
                },

                yAxis: {
                    categories: data.yCategories,
                    title: 'Horarios'
                },

                colorAxis: {
                    min: 0,
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },

                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 0,
                    verticalAlign: 'top',
                    y: 25,
                    symbolHeight: 280
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + areas[this.point.x] + ': ' +
                            this.point.value + '</b>%'
                    }
                },

                series: [{
                    name: 'Porcentaje Concurrencia',
                    borderWidth: 1,
                    data: data.data,
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }]
            });
        });
    };

    this.updateDescriptionTable = function(id, data) {
        var tab = '';
        tab = '<table class="table"><tr style="font-weight:bold;"><td>#</td><td>Nombre del Area</td></tr>';
        tab += '<tbody>';

        for( var i = 0; i < data.length; i++ ) {
            tab += '<tr>';
            for( var x = 0; x < data[i].length; x++ ) {
                tab += '<td>' + data[i][x] + '</td>';
            }
            tab += '</tr>';
        }

        tab += '</tbody></table>';

        $(id).html(tab);
    };

    //this.updateStoreList('#store', config.dashUrl, $scope.brandId);
    this.updateHeatmapTable('#afluencia', '#descriptionTable', 'http://api.allshoppings.mobi/appv2', '2015-07-01', '2015-07-07', 'cinepolis_mx', 'cinepolis_mx_339', 0);

    return vm;
};

angular
    .module('bdb')
    .controller('DemoAreasCtrl', DemoAreasCtrl);
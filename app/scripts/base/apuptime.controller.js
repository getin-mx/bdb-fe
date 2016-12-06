/**
 * APDevicesCtrl - controller
 */
function APUptimeCtrl($scope, $stateParams, $location, $http, CommonsService, AuthenticationService) {

	var vm = this;

    $scope.init = function() {

        if( $stateParams.hostname !== undefined ) {
            $scope.hostname = $stateParams.hostname;
        } else {
            $scope.hostname = document.getElementById('hostnameParam').value;
        }

	    var dToDate = new Date(new Date().getTime() - config.oneDay);
	    var dFromDate = new Date(dToDate.getTime() - config.oneMonth);

	    $scope.toDate = dToDate.format("yyyy-mm-dd", null);
	    $('#toDate').val($scope.toDate);
	    $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
	    $('#fromDate').val($scope.fromDate);

	    $scope.refresh();

    }

	$scope.refresh = function() {

		$scope.toDate = $('#toDate').val();
		$scope.fromDate = $('#fromDate').val();

		$scope.loadingRefresh = true;
		$http.get(CommonsService.getUrl('/dashboard/apuptime') + '&identifier=' + $scope.hostname 
			+ '&fromStringDate=' + $scope.fromDate + '&toStringDate=' + $scope.toDate)
			.then($scope.fillTable);

	}

	$scope.fillTable = function(data) {
        $('#heatmap_apuptime').highcharts({
            chart: {
                type: 'heatmap',
                marginLeft: 200,
                marginRight: 200
            },
            title: {
                text: 'Uptime por dia para antena ' + $scope.hostname
            },
            xAxis: {
                categories: data.data.xCategories,
                title: 'Dias'
            },
            yAxis: {
                categories: data.data.yCategories,
                title: 'Horarios'
            },
            colorAxis: {
                min: 0,
                minColor: '#FF0000',
                maxColor: '#FFFFFF'
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
                formatter: function() {
                    return this.point.value + '%';
                }
            },
            series: [{
                borderWidth: 1,
                borderColor: '#137499',
                data: data.data.data,
                dataLabels: {
                    enabled: false,
                    color: '#000000'
                }
            }]
        });

        $scope.loadingRefresh = false;
    };

	return vm;

};

angular
	.module('bdb')
	.controller('APUptimeCtrl', APUptimeCtrl);
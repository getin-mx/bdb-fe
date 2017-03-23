/**
 * APDVisitsCtrl - controller
 */
 function APDVisitsCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http, SweetAlert) {

    var vm = this;

    $scope.classUser = 'hidden';
    $scope.classAdmin = 'hidden';
    $scope.visitsOnly = false;

    var dToDate = new Date(new Date().getTime() - config.oneDay);
    var dFromDate = new Date(dToDate.getTime() - config.oneWeek);

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.storeLabel = '';

    $scope.initAPDVisits = function(visitsOnly) {

        if( visitsOnly == true ) $scope.visitsOnly = true;
        else $scope.visitsOnly = false;

        if(globals.currentUser.role == 1) {
            $('#exportDetails').css('display','block');
            $scope.classUser = 'hidden';
            $scope.classAdmin = '';
            $scope.detailsExportable = '';
        } else {
            $('#exportDetails').css('display','none');
            $scope.classUser = 'hidden';
            $scope.classAdmin = 'hidden';
            $scope.detailsExportable = 'hidden';
        }

        $http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
        .then($scope.initAPDVisitsPhase2);
    }

    $scope.initAPDVisitsPhase2 = function(data) {

        $scope.toDate = dToDate.format("yyyy-mm-dd", null);
        $('#toDate').val($scope.toDate);
        $scope.fromDate = dFromDate.format("yyyy-mm-dd", null);
        $('#fromDate').val($scope.fromDate);
        $scope.storeId = '';

        $('#brandId').find('option').remove()

        if( data.data.data.length == 1 ) {
            $('#brandSelectorContainer').css('display','none');
            selected = data.data.data[0].identifier;
        } else {
            $('#brandSelectorContainer').css('display','block');
            for(var i = 0; i < data.data.data.length; i++) {
                if( i == 0 ) selected = data.data.data[i].identifier;
                $('#brandId').append($('<option>', { 
                    value: data.data.data[i].identifier,
                    text : data.data.data[i].name 
                }));
            }
        }
        $scope.brandId = selected;
        $('#brandId').val(selected);
        $scope.updateStoreLabel();

        $scope.updateStoreList('#store', config.dashUrl, $scope.brandId);
        $scope.updateAPDVisits();
    }

    $scope.updateBrand = function() {
        $scope.loadingSubmit = true;
        $scope.brandId = $('#brandId').val();
        $scope.updateStoreLabel();
        $scope.updateStoreList('#store', config.dashUrl, $scope.brandId);
        $scope.updateAPDVisits();
        $scope.loadingSubmit = false;
    }

    $scope.updateStoreLabel = function() {
        $http.get(CommonsService.getUrl('/dashboard/config')
            + '&entityId=' + $scope.brandId 
            + '&entityKind=1')
        .then($scope.postUpdateStoreLabel);
    }

    $scope.postUpdateStoreLabel = function(data) {
        try {
            $scope.storeLabel = data.data.storeLabel;
            if( $scope.storeLabel === undefined || $scope.storeLabel == null )
                $scope.storeLabel = 'Tienda';
        } catch( e ) {
            $scope.storeLabel = 'Tienda';
        }
        try {
            $scope.visitsComments = data.data.visitsComments;
        } catch( e ) {
        }

        if ($scope.visitsComments != '' && $scope.visitsComments !== undefined && $scope.classAdmin == 'hidden') {
            $scope.classUser = '';
        }
    }    

    $scope.updateComments = function() {
        $scope.loadingSubmit = true;

        $scope.dashboard = {
            entityId: $scope.brandId,
            entityKind: 1,
            visitsComments: $scope.visitsComments
        }

        $http.post((CommonsService.getUrl('/dashboard/config')), $scope.dashboard)
        .then(function(data) {
            console.log(data);

            if( data.status = 200 && data.data.error_code === undefined ) {
                SweetAlert.swal({
                    title: "Ok!",
                    text: "Los comentarios fueron salvados con éxito",
                    type: "success"
                });

                $scope.loadingSubmit = false;

            } else {
                SweetAlert.swal({
                    title: "Error!",
                    text: "Los comentarios no pudieron salvarse",
                    type: "error"
                });
            }
        });
    }

    $scope.exportAPDVisits = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/brandExport' 
        + '?authToken=' + $rootScope.globals.currentUser.token 
        + '&brandId=' + $scope.brandId 
        + '&storeId=' + $scope.storeId
        + '&fromStringDate=' + $scope.fromDate
        + '&toStringDate=' + $scope.toDate

        window.open(url);
    }

    $scope.exportDetails = function() {
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

        $('#visits_by_date').html('');
        $('#visits_by_hour').html('');
        $('#repetitions').html('');
        $('#permanence_by_hour').html('');
        $('#heatmap_traffic_by_hour').html('');
        $('#heatmap_permanence_by_hour').html('');
        $('#brand_performance_table').html('');

        vm.updateVisitsByDateChart('#visits_by_date', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateVisitsByHourChart('#visits_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateRepetitionsChart('#repetitions', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updatePermanenceByHourChart('#permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateHeatmapTraffic('#heatmap_traffic_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateHeatmapPermanence('#heatmap_permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId);
        vm.updateBrandPerformanceTable('#brand_performance_table', config.dashUrl, fromDate, toDate, brandId);
    }

    $scope.updateStoreList = function(id, baseUrl, entityId) {
        $http.get(CommonsService.getUrl('/dashboard/assignedStoreList')
            + '&entityId=' + $scope.brandId 
            + '&entityKind=1&onlyExternalIds=true')
        .then($scope.postUpdateStoreList);
    }

    $scope.postUpdateStoreList = function(data) {
        id = '#store';
        $(id).empty();
        $(id).append($('<option>', {
            value: '',
            text: 'Todas'
        }));

        for( var i = 0; i < data.data.data.length; i++ ) {
            $(id).append($('<option>', {
                value: data.data.data[i].identifier,
                text: data.data.data[i].name
            }));
        }
    }

    this.updateVisitsByDateChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/timelineData'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_visits,'
            + 'visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=false';
        else 
            url = baseUrl 
            + '/dashoard/timelineData'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
            + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=false';


        $.getJSON( url,
            function(data) {
                // Disable extra options by default
                var from = 2;
                if( $scope.visitsOnly == true ) from = 1;
                for( var i = from; i < data.series.length; i++)
                    data.series[i].visible = false;

                $(id).highcharts({
                    chart: {
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Tráfico por Día'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Tráfico por Día'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data.series
                });
            });
    };
    this.updateVisitsByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_visits,'
            + 'visitor_total_visits_ios,visitor_total_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=true';
        else 
            url = baseUrl 
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
            + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=true';


        $.getJSON( url,
            function(data) {
                // Disable extra options by default
                var from = 2;
                if( $scope.visitsOnly == true ) from = 1;
                for( var i = from; i < data.series.length; i++)
                    data.series[i].visible = false;

                $(id).highcharts({
                    chart: {
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Tráfico por Hora'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Tráfico por Hora'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data.series
                });
            });
    };
    this.updateRepetitionsChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/repetitions'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_visits'
            + 'visitor_total_visits_ios,visitor_total_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=true';
        else 
            url = baseUrl 
            + '/dashoard/repetitions'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
            + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&eraseBlanks=true';

        $.getJSON(url,
            function(data) {
                // Disable extra options by default
                $(id).highcharts({
                    chart: {
                        type: 'column',
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Repeticiones'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Repeticiones'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data.series
                });
            });
    };
    this.updatePermanenceByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_permanence' 
            + '&subIdOrder=permanence_hourly_visits,'
            + 'permanence_hourly_visits_ios,permanence_hourly_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=true' 
            + '&toMinutes=true' 
            + '&eraseBlanks=true';
        else 
            url = baseUrl 
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_permanence' 
            + '&subIdOrder=permanence_hourly_peasents,permanence_hourly_visits,permanence_hourly_peasents_ios,'
            + 'permanence_hourly_peasents_android,permanence_hourly_visits_ios,permanence_hourly_visits_android' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=true' 
            + '&toMinutes=true' 
            + '&eraseBlanks=true';

        $.getJSON( url,
            function(data) {
                // Disable extra options by default
                if( $scope.visitsOnly == true ) {
                    for( var i = 1; i < data.series.length; i++)
                        data.series[i].visible = false;
                } else {
                    data.series[0].visible = false;
                    for( var i = 2; i < data.series.length; i++)
                        data.series[i].visible = false;
                }

                $(id).highcharts({
                    chart: {
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Permanencia'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Permanencia en Minutos'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ':00 Minutos'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data.series
                });
            });
    };
    this.updateHeatmapTraffic = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&elementSubId=visitor_total_visits'
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=false' 
            + '&toMinutes=false' 
            + '&eraseBlanks=true';
        else 
            url = baseUrl 
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_visitor' 
            + '&elementSubId=visitor_total_visits,visitor_total_peasents'
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=false' 
            + '&toMinutes=false' 
            + '&eraseBlanks=true';

        $.getJSON(url, 
            function(data) {

                var p = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var p1 = p[ob[0]];
                    if( p1 === null || p1 === undefined )  {
                        p1 = new Array();
                        p[ob[0]] = p1;
                    }
                    var val = ob[3];
                    p1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Visitas por Hora'
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
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
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
                            if($scope.visitsOnly == true ) {
                                return this.point.value + ' <strong>Visitantes</strong>';
                            } else {
                                return this.point.value + ' <strong>Visitantes</strong> <br/>' + p[this.point.x][this.point.y]    + ' <strong>Paseantes</strong>';
                            }
                        }
                    },
                    series: [{
                        borderWidth: 1,
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };
    this.updateHeatmapPermanence = function(id, baseUrl, fromDate, toDate, entityId, subEntityId) {
        var url = null;

        if( $scope.visitsOnly == true ) 
            url = baseUrl 
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_permanence' 
            + '&elementSubId=permanence_hourly_visits' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=true' 
            + '&toMinutes=true' 
            + '&eraseBlanks=true';
        else 
            url = baseUrl 
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&subentityId=' + subEntityId 
            + '&elementId=apd_permanence' 
            + '&elementSubId=permanence_hourly_visits,permanence_hourly_peasents' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&average=true' 
            + '&toMinutes=true' 
            + '&eraseBlanks=true';

        $.getJSON(url,
            function(data) {

                var p = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var p1 = p[ob[0]];
                    if( p1 === null || p1 === undefined )  {
                        p1 = new Array();
                        p[ob[0]] = p1;
                    }
                    var val = ob[3];
                    p1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Permanencia por Hora'
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
                        //maxColor: Highcharts.getOptions().colors[0]
                        maxColor: '#137499'
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
                            if( $scope.visitsOnly == true ) {
                                return '<strong>Visitantes: </strong>' + this.point.value + ' minutos';
                            } else {
                                return '<strong>Visitantes: </strong>' + this.point.value + ' minutos <br/> <strong>Paseantes: </strong>' + p[this.point.x][this.point.y]    + ' minutos';
                            }
                        }
                    },
                    series: [{
                        borderWidth: 1,
                        borderColor: '#137499',
                        data: data.data,
                        dataLabels: {
                            enabled: false,
                            color: '#000000'
                        }
                    }]
                });
            });
    };
    this.updateBrandPerformanceTable = function(id, baseUrl, fromDate, toDate, entityId) {
        $.getJSON(
            baseUrl 
            + '/dashoard/brandTableData'
            + '?authToken=' + $rootScope.globals.currentUser.token 
            + '&entityId=' + entityId 
            + '&entityKind=1' 
            + '&fromStringDate=' + fromDate 
            + '&toStringDate=' + toDate 
            + '&onlyExternalIds=true',
            function(data) {
                var tab = '';
                tab = '<table class="table table-striped" style="text-align: center;" >';
                tab += '<tr style="font-weight:bold;">';
                tab += '<td>' + $scope.storeLabel + '</td>';
                if( $scope.visitsOnly == false )
                    tab += '<td>Paseantes</td>';
                tab += '<td>Visitantes</td>';
                tab += '<td>Tickets</td>';
                if( $scope.visitsOnly == false )
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
                            if( $scope.visitsOnly == false || (x != 1 & x != 4))
                                tab += '<td>' + data[i][x] + '</td>';
                    }
                    tab += '</tr>';
                }
                tab += '<tr style="font-weight:bold;">';
                for (var x = 0; x < data[data.length - 1].length; x++) {
                    if (x == 0 || x == 3 || x == 5 || x == 7)
                        tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                    else
                        if( $scope.visitsOnly == false || (x != 1 & x != 4))
                            tab += '<td>' + data[data.length - 1][x] + '</td>';
                }
                tab += '</tr></tbody></table>';

                tab += '</tbody>';
                tab += '</table>';
                $(id).html(tab);
            });
    };

    return vm;
};

angular
.module('bdb')
.controller('APDVisitsCtrl', APDVisitsCtrl);
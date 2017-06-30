/**
 * APDVisitsCtrl - controller
 */
 function APDVisitsCtrl($rootScope, $scope, AuthenticationService, CommonsService, $rootScope, $http, SweetAlert) {

    var vm = this;

    $scope.classUser = 'hidden';
    $scope.classAdmin = 'hidden';
    $scope.visitsOnly = false;
    $scope.retailCalendar = config.retailCalendar;
    $scope.retailCalendarDate = null;
    $scope.zoneAble = 'hidden';
    $scope.showRevenue = false;
    $scope.periodType = 'D';

    var globals = AuthenticationService.getCredentials();
    var credentials = globals.currentUser;

    $scope.storeLabel = '';

    $scope.dateChange = function() {
        alert("date changed");
    }

    $scope.findRetailCalendarDate = function() {
        var d = new Date(new Date().getTime() - config.oneDay).format("yyyy-mm-dd");
        for( var i = 0; i < $scope.retailCalendar.length; i++ ) {
            if($scope.retailCalendar[i].fromDate <= d && $scope.retailCalendar[i].toDate >= d)
                $scope.retailCalendarDate = $scope.retailCalendar[i];
        }
        $scope.retailCalendarChange();

        $('.datelistener').each(function() {
            var elem = $(this);

            // Save current value of element
            elem.data('oldVal', elem.val());

            // Look for changes in the value
            elem.bind("propertychange change click keyup input paste blur focus", function(event){
                // If value has changed...
                if (elem.data('oldVal') != elem.val()) {
                    // Updated stored value
                    elem.data('oldVal', elem.val());

                    var fd = $('#fromDate').val();
                    var td = $('#toDate').val();

                    $scope.retailCalendarDate = null;
                    for( var i = 0; i < $scope.retailCalendar.length; i++ ) {
                        if($scope.retailCalendar[i].fromDate == fd && $scope.retailCalendar[i].toDate == td)
                            $scope.retailCalendarDate = $scope.retailCalendar[i];
                    }
                }
            });
       });
    }

    $scope.retailCalendarChange = function() {
        if($scope.retailCalendarDate != null ) {
            $scope.toDate = $scope.retailCalendarDate.toDate;
            $('#toDate').val($scope.toDate);
            $scope.fromDate = $scope.retailCalendarDate.fromDate;
            $('#fromDate').val($scope.fromDate);
        }
    }

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

        $scope.findRetailCalendarDate();

        $http.get(CommonsService.getUrl('/dashboard/assignedBrandList'))
        .then($scope.initAPDVisitsPhase2);
    }

    $scope.initAPDVisitsPhase2 = function(data) {

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

        // Please change this!
        if( $scope.brandId == 'aditivo_mx' || $scope.brandId == '98coastav_mx' || $scope.brandId == 'botanicus_mx' || $scope.brandId == 'tonymoly_mx' || $scope.brandId == 'areasmexico_mx' || $scope.brandId == 'liverpoolboutiques_mx')
            $scope.showRevenue = true;
        else
            $scope.showRevenue = false;

        $scope.updateStoreLabel();
        $scope.updateStoreList('#store', config.dashUrl, $scope.brandId);
        $scope.updateAPDVisits();
    }

    $scope.updateBrand = function() {
        $scope.loadingSubmit = true;
        $scope.brandId = $('#brandId').val();

        // Please change this!
        if( $scope.brandId == 'aditivo_mx' || $scope.brandId == '98coastav_mx' || $scope.brandId == 'botanicus_mx' || $scope.brandId == 'tonymoly_mx' || $scope.brandId == 'areasmexico_mx' || $scope.brandId == 'liverpoolboutiques_mx')
            $scope.showRevenue = true;
        else
            $scope.showRevenue = false;

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

    $scope.exportReport = function() {
        $scope.fromDate = $('#fromDate').val();
        $scope.toDate = $('#toDate').val();

        var url =  config.baseUrl + '/dashboard/reportExport'
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

    $scope.updateGraphs = function(periodType) {
        $scope.periodType = periodType;

        $('#btnGraphDaily').removeClass('active');
        $('#btnGraphWeekly').removeClass('active');
        $('#btnGraphMonthly').removeClass('active');

        if( periodType == 'D' ) {
            $('#btnGraphDaily').addClass('active');
        } else if( periodType == 'W' ) {
            $('#btnGraphWeekly').addClass('active');
        } else if( periodType == 'M' ) {
            $('#btnGraphMonthly').addClass('active');
        }

        $('#visits_by_date').html('');
        vm.updateVisitsByDateChart('#visits_by_date', config.dashUrl, $scope.fromDate, $scope.toDate, $scope.brandId, $scope.storeId, $scope.zoneId, $scope.periodType);
    }

    this.filterAPDVisits = function(brandId, storeId, fromDate, toDate) {

        $('#visits_by_date').html('');
        $('#visits_by_hour').html('');
        $('#repetitions').html('');
        $('#permanence_by_hour').html('');
        $('#heatmap_traffic_by_hour').html('');
        $('#heatmap_occupation_by_hour').html('');
        $('#heatmap_permanence_by_hour').html('');
        $('#brand_performance_table').html('');

        vm.updateVisitsByDateChart('#visits_by_date', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId, $scope.periodType);
        vm.updateVisitsByHourChart('#visits_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        if( brandId == 'grupopavel_mx') {
            vm.updateRepetitionsChart('#repetitions', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        }
        vm.updatePermanenceByHourChart('#permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        vm.updateHeatmapTraffic('#heatmap_traffic_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        vm.updateHeatmapPermanence('#heatmap_permanence_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        vm.updateHeatmapOccupation('#heatmap_occupation_by_hour', config.dashUrl, fromDate, toDate, brandId, storeId, $scope.zoneId);
        vm.updateBrandPerformanceTable('#brand_performance_table', config.dashUrl, fromDate, toDate, brandId);
    }

    $scope.updateZoneList = function(id, entityId) {
        $http.get(CommonsService.getUrl('/dashboard/innerZoneList')
            + '&entityId=' + entityId
            + '&entityKind=1')
        .then(function(data) {
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
        });
    }

    $scope.updateStoreList = function(id, baseUrl, entityId) {
        if( $scope.brandId == 'volaris_mx') {
            $scope.zoneAble = '';
        } else {
            $scope.zoneAble = 'hidden';
        }
        $scope.updateZoneList('#zone', $scope.brandId);

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

    this.updateVisitsByDateChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId, periodType) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/timelineData'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_visits,'
            + 'visitor_total_visits_ios,visitor_total_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&periodType=' + periodType
            + '&eraseBlanks=false'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            if( $scope.showRevenue == true )
                url = baseUrl
                + '/dashoard/timelineData'
                + '?authToken=' + $rootScope.globals.currentUser.token
                + '&entityId=' + eid
                + '&entityKind=' + kind
                + '&subentityId=' + seid
                + '&elementId=apd_visitor'
                + '&subIdOrder=visitor_total_revenue,visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
                + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets,visitor_total_items'
                + '&fromStringDate=' + fromDate
                + '&toStringDate=' + toDate
                + '&periodType=' + periodType
                + '&eraseBlanks=false'
                + '&timestamp=' + CommonsService.getTimestamp();
            else
                url = baseUrl
                + '/dashoard/timelineData'
                + '?authToken=' + $rootScope.globals.currentUser.token
                + '&entityId=' + eid
                + '&entityKind=' + kind
                + '&subentityId=' + seid
                + '&elementId=apd_visitor'
                + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
                + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_total_tickets,visitor_total_items'
                + '&fromStringDate=' + fromDate
                + '&toStringDate=' + toDate
                + '&periodType=' + periodType
                + '&eraseBlanks=false'
                + '&timestamp=' + CommonsService.getTimestamp();


        $.getJSON( url,
            function(data) {
                // Disable extra options by default

                var from = 2;
                if( $scope.visitsOnly == true ) from = 1;
                if( $scope.showRevenue == true ) {
                    from = 3;
                    data.series[0].color = 'rgba(26, 179, 148, 0.5)';
                    // data.series[0].color = "#1ab394";
                }
                for( var i = from; i < data.series.length; i++){
                    data.series[i].visible = false;
                }

                $(id).highcharts({
                    chart: {
                        zoomType: 'xy',
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Tráfico por Día'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: [{
                        title: {
                            text: 'Tráfico por Día'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },{ // Secondary yAxis
                        title: {
                            text: 'Ventas'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }],
                        opposite: true
                    }],
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
    this.updateVisitsByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_visits,'
            + 'visitor_total_visits_ios,visitor_total_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
            + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();


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
    this.updateRepetitionsChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true ) {
            return;
            url = baseUrl
            + '/dashoard/repetitions'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_visits'
            + 'visitor_total_visits_ios,visitor_total_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        } else
            url = baseUrl
            + '/dashoard/repetitions'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&subIdOrder=visitor_total_peasents,visitor_total_visits,visitor_total_peasents_ios,'
            + 'visitor_total_peasents_android,visitor_total_visits_ios,visitor_total_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

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
    this.updatePermanenceByHourChart = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&subIdOrder=permanence_hourly_visits,'
            + 'permanence_hourly_visits_ios,permanence_hourly_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

        else
            url = baseUrl
            + '/dashoard/timelineHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&subIdOrder=permanence_hourly_peasents,permanence_hourly_visits,permanence_hourly_peasents_ios,'
            + 'permanence_hourly_peasents_android,permanence_hourly_visits_ios,permanence_hourly_visits_android'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

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
    this.updateHeatmapTraffic = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_visitor'
            + '&elementSubId=visitor_total_visits,visitor_total_peasents,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=false'
            + '&toMinutes=false'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

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

                var q = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var q1 = q[ob[0]];
                    if( q1 === null || q1 === undefined )  {
                        q1 = new Array();
                        q[ob[0]] = q1;
                    }
                    var val = ob[4];
                    q1[ob[1]] = val;
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
                            if( $scope.visitsOnly == true || vo == true ) {
                                return this.point.value + ' <strong>Visitantes</strong>';
                            } else {
                                return this.point.value + ' <strong>Visitantes</strong> <br/>' + p[this.point.x][this.point.y] + ' <strong>Paseantes</strong> <br/>' + q[this.point.x][this.point.y] + ' <strong>Tickets</strong>';
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
    this.updateHeatmapPermanence = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_permanence'
            + '&elementSubId=permanence_hourly_visits,permanence_hourly_peasents'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

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
                            if( $scope.visitsOnly == true || vo == true ) {
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
    this.updateHeatmapOccupation = function(id, baseUrl, fromDate, toDate, entityId, subEntityId, zoneId) {
        var url = null;

        var eid;
        var seid;
        var kind;
        var vo = false;

        if( zoneId === undefined || zoneId == '') {
            eid = entityId;
            seid = subEntityId;
            kind = 1;
            vo = false;
        } else {
            eid = zoneId;
            seid = zoneId;
            kind = 20;
            vo = true;
        }

        if( $scope.visitsOnly == true || vo == true )
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation'
            + '&elementSubId=occupation_hourly_visits'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();
        else
            url = baseUrl
            + '/dashoard/heatmapTableHour'
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + eid
            + '&entityKind=' + kind
            + '&subentityId=' + seid
            + '&elementId=apd_occupation,apd_visitor'
            + '&elementSubId=occupation_hourly_visits,occupation_hourly_peasants,visitor_hourly_tickets'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&average=true'
            + '&toMinutes=true'
            + '&eraseBlanks=true'
            + '&timestamp=' + CommonsService.getTimestamp();

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

                var q = new Array();
                for( var i = 0; i < data.data.length; i++) {
                    var ob = data.data[i];
                    var q1 = q[ob[0]];
                    if( q1 === null || q1 === undefined )  {
                        q1 = new Array();
                        q[ob[0]] = q1;
                    }
                    var val = ob[4];
                    q1[ob[1]] = val;
                }

                $(id).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginLeft: 200,
                        marginRight: 200
                    },
                    title: {
                        text: 'Ocupacion por Hora'
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
                            if( $scope.visitsOnly == true || vo == true ) {
                                return this.point.value + ' <strong>Visitantes</strong>';
                            } else {
                                return this.point.value + ' <strong>Visitantes</strong> <br/>' + p[this.point.x][this.point.y] + ' <strong>Paseantes</strong> <br/>' + q[this.point.x][this.point.y] + ' <strong>Tickets</strong>';
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
            + (entityId == 'volaris_mx' ? '/dashoard/brandTableData2' : '/dashoard/brandTableData')
            + '?authToken=' + $rootScope.globals.currentUser.token
            + '&entityId=' + entityId
            + '&entityKind=1'
            + '&fromStringDate=' + fromDate
            + '&toStringDate=' + toDate
            + '&onlyExternalIds=true'
            + '&timestamp=' + CommonsService.getTimestamp(),
            function(data) {
                var tab = '';
                tab = '<table class="table table-striped" style="text-align: center;" >';
                tab += '<tr style="font-weight:bold;">';
                tab += '<td style="text-align: left; border-right: 1px solid gray;">' + $scope.storeLabel + '</td>';
                if( $scope.visitsOnly == false )
                    tab += '<td>Paseantes</td>';                    // 1
                tab += '<td>Visitantes</td>';                       // 2
                if( $scope.visitsOnly == false ) {
                    tab += '<td>Tickets</td>';                      // 3
                    if( entityId != 'volaris_mx' ) {
                        tab += '<td>Ventas</td>';                   // 4
                    }
                    tab += '<td>Paseantes/Visitantes</td>';         // 5
                    tab += '<td>Visitantes/Tickets</td>';           // 6
                }
                tab += '<td>Día más Alto</td>';                     // 7
                tab += '<td>Día más Bajo</td>';                     // 8
                tab += '<td>Permanencia Promedio</td>';             // 9
                tab += '</tr>';
                tab += '<tbody>';
                for (var i = 1; i < data.length - 1; i++) {
                    tab += '<tr>';
                    tab += '<td style="text-align: left; border-right: 1px solid gray;">' + data[i][0] + '</td>';
                    for (var x = 1; x < data[i].length; x++) {
                        if ( $scope.visitsOnly == false ) {
                            if ( x == 0 || x == 4 || x == 6 || x == 8 ) {
                                if( $scope.visitsOnly == false || (x != 4 && x != 6) ) {
                                    tab += '<td style="border-right: 1px solid gray;">' + data[i][x] + '</td>';
                                }
                            } else {
                                if( $scope.visitsOnly == false || (x != 1 && x != 4) ) {
                                    tab += '<td>' + data[i][x] + '</td>';
                                }
                            }
                        }else{
                            if (x == 0 || x == 3 || x == 5 || x == 7) {
                                if( $scope.visitsOnly == false || (x != 3 && x != 5) ) {
                                    tab += '<td style="border-right: 1px solid gray;">' + data[i][x] + '</td>';
                                }
                            } else {
                                if( $scope.visitsOnly == false || (x != 1 && x != 4 && x != 6) ) {
                                    tab += '<td>' + data[i][x] + '</td>';
                                }
                            }
                        }
                    }// end for
                    tab += '</tr>';
                }
                tab += '<tr style="font-weight:bold;">';
                tab += '<td style="text-align: left; border-right: 1px solid gray;">' + data[data.length - 1][0] + '</td>';
                for (var x = 1; x < data[data.length - 1].length; x++) {
                    if ($scope.visitsOnly == false ) {
                        if (x == 0 || x == 4 || x == 6 || x == 8) {
                            if( $scope.visitsOnly == false || (x != 4 && x != 6)) {
                                tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                            }
                        } else {
                            if( $scope.visitsOnly == false || (x != 1 && x != 4)) {
                                tab += '<td>' + data[data.length - 1][x] + '</td>';
                            }
                        }
                    }else {
                        if (x == 0 || x == 3 || x == 5 || x == 7) {
                            if( $scope.visitsOnly == false || (x != 3 && x != 5)) {
                                tab += '<td style="border-right: 1px solid gray;">' + data[data.length - 1][x] + '</td>';
                            }
                        } else {
                            if( $scope.visitsOnly == false || (x != 1 && x != 4 && x != 6)) {
                                tab += '<td>' + data[data.length - 1][x] + '</td>';
                            }
                        }
                    }
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
